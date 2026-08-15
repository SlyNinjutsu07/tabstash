console.log("popup loaded!");

function refreshPopup(){
    
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
            icon: tab.favIconUrl
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