console.log("popup loaded!");

async function createFolder(folderName){
    try {
        const result = await chrome.storage.sync.get(["__folders__"])
        const folders = result["__folders__"] ?? [] // making a new array if one doesnt exist

        //guard against empty strings or null
        folderName = folderName?.trim() 
        if(!folderName) return

        //check if folders doesnt exist
        if (!folders.includes(folderName)){
            folders.push(folderName)
            await chrome.storage.sync.set({["__folders__"]: folders})
        }
        drawPopup()
    } catch (e){
        console.error("Error making new folder...", e)
    }
}

async function deleteFolder(folder){
    try {
        const result = await chrome.storage.sync.get(["__folders__"])
        let folders = result["__folders__"]
        folders = folders.filter(item => item !== folder)
        await chrome.storage.sync.set({["__folders__"]: folders})
        drawPopup()
    } catch (error){
        console.error("Error deleting folder...", error)
    }
}

async function getTabs(){
    try {
        const data = await chrome.storage.sync.get(null) // All data objects

        return data
    } catch (error){
        console.error("Error reading chrome.storage.sync...", error)
    }
}

async function openTab(targetURL){
    try {
        if (targetURL){
            await chrome.tabs.create({url: targetURL})
        }
    } catch(e){
        console.error("Failed to open tab...", e)
    }
    
}

async function deleteTab(urlKey){
    try {
        await chrome.storage.sync.remove(urlKey)  // promise form — wait for it
        drawPopup()                                // now provably runs after removal
    } catch (error) {
        console.error("Error deleting tab...", error)
    }
}

async function saveTab(){
    try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true})

        if (!tab){
            console.error("no tab found")
            return
        }

        const url_normalized = normalizeURL(tab.url)

        const tabResult = await chrome.storage.sync.get([url_normalized])
        if(tabResult[url_normalized] !== undefined){
            console.log("Tab exists already!")
            showAlreadySavedNotice()
            return
        }

        const tabData = {
            title: tab.title,
            url: url_normalized,
            timeSaved: new Date().toISOString(),
            folder: "None",
            iconURL: tab.favIconUrl
        }

        await chrome.storage.sync.set({[tabData.url]: tabData})
        console.log("Tab saved successfully:", tabData)
    } catch(error){
        console.error("error saving tab...", error)
    }
}

async function drawPopup(){
    const data = await getTabs()
    const folders = data["__folders__"] ?? [] 
    delete data["__folders__"]

    // The container we draw the list into
    const list = document.querySelector("#app")

    // Refresh: wipe whatever is there before rebuilding, so calling
    // drawPopup() again never duplicates rows
    list.innerHTML = ""

    

    // data is undefined if getTabData hit its catch; fall back to {}
    const entries = Object.entries(data ?? {})

    // Empty state: nothing saved yet
    if (entries.length === 0) {
        const empty = document.createElement("p")
        empty.className = "empty-msg"
        empty.textContent = "No saved tabs yet."
        list.appendChild(empty)
        return
    }

    buildFolders(folders, list)

    buildSavedTabs(entries, list)
    
}


// Shows a green "Already Saved!" banner at the top-center of the popup,
// then fades it out. Reuses one element so rapid clicks don't stack banners.
function showAlreadySavedNotice(){
    let notice = document.querySelector("#saved-notice")

    // Create it once, on first use
    if (!notice) {
        notice = document.createElement("div")
        notice.id = "saved-notice"
        notice.className = "saved-notice"
        notice.textContent = "Already Saved!"
        document.body.appendChild(notice)
    }

    // Show it, and reset the auto-hide timer if it's already showing
    notice.classList.add("show")
    clearTimeout(notice.hideTimer)
    notice.hideTimer = setTimeout(() => notice.classList.remove("show"), 1800)
}

const saveTabButton = document.querySelector("#add-btn")
saveTabButton.addEventListener("click", async () => {
    await saveTab()   // wait for the write to finish...
    drawPopup()           // ...then redraw so the new tab shows immediately
})

const addFolderButton = document.querySelector("#add-folder-btn")
addFolderButton.addEventListener("click", async (event) => {
    //TODO: implementation 
    folderName = prompt("Name for your folder: ")
    createFolder(folderName)
})

const app = document.querySelector('#app')
app.addEventListener("click", async (event) => {
        const del = event.target.closest(".tab-delete")
        if (del){
            await deleteTab(del.dataset.url)
            return
        }

        const open = event.target.closest(".tab-open")
        if(open){
            await openTab(open.dataset.url)
            return
        }

        const folderDel = event.target.closest(".folder-delete")
        if (folderDel) { await deleteFolder(folderDel.dataset.folder); return }

        const folderHeader = event.target.closest(".folder-header")
        if (folderHeader) {
            const folderRow = folderHeader.closest(".folder-row")
            const isCollapsed = folderRow.classList.toggle("collapsed")   // flip open/shut

            if(!isCollapsed) expandedFolders.add(folderHeader.dataset.folder)
            else expandedFolders.delete(folderHeader.dataset.folder)

            const folderIcon = folderHeader.querySelector(".folder-icon")
            folderIcon.src = expandedFolders.has(folderHeader.dataset.folder) ? "icons/open-folder.svg" : "icons/closed-folder.svg"
            return
        }
    })



drawPopup()

