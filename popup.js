console.log("popup loaded!");

async function getTabData(){
    try {
        const data = await chrome.storage.sync.get(null) // All data objects

        for (const [url, data] in Object.entries(data)){
            console.log("The URL key is: ", url)
            console.log("Saved object is: ", data)
        }
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

const saveTabButton = document.querySelector("#add-btn")

saveTabButton.addEventListener("click", () => {
    saveTabData()
})
