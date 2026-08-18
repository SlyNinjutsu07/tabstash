console.log("popup loaded!");

async function getTabData(){
    try {
        const data = await chrome.storage.sync.get(null) // All data objects

        return data
    } catch (error){
        console.error("Error reading chrome.storage.sync...", error)
    }
}

async function saveTabData(){
    try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true})

        if (!tab){
            console.error("no tab found")
            return
        }

        const tabData = {
            title: tab.title,
            url: tab.url,
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
    const data = await getTabData()

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

    // Build one row per saved tab
    for (const [url, tab] of entries) {
        // Row container. A <div> for now; the URL rides along in
        // data-url so your future click handler can read row.dataset.url
        const row = document.createElement("div")
        row.className = "tab-row"
        row.dataset.url = url

        // Favicon image. If the site's icon fails to load (some tabs
        // have none), swap in a bundled placeholder image
        const favicon = document.createElement("img")
        favicon.className = "tab-favicon"
        favicon.src = tab.iconURL || "icons/empty-website-logo.png"
        favicon.alt = ""   // decorative: the title text sits right beside it
        favicon.onerror = () => {
            favicon.onerror = null   // stop, so a missing fallback can't loop forever
            favicon.src = "icons/empty-website-logo.png"
        }

        // Title text. textContent (not innerHTML) so a page title
        // containing HTML can't inject markup into the popup
        const title = document.createElement("span")
        title.className = "tab-title"
        title.textContent = tab.title || url

        // Assemble: favicon + title into the row, row into the list
        row.appendChild(favicon)
        row.appendChild(title)
        list.appendChild(row)
    }
}


const saveTabButton = document.querySelector("#add-btn")

saveTabButton.addEventListener("click", async () => {
    await saveTabData()   // wait for the write to finish...
    drawPopup()           // ...then redraw so the new tab shows immediately
})

drawPopup()

