function buildSavedTabs(tabEntries, list){
    // Build one row per saved tab
    for (const [url, tabData] of tabEntries) {
        // Row container. A <div> for now; the URL rides along in
        // data-url so your future click handler can read row.dataset.url
        const row = document.createElement("div")
        row.className = "tab-row"
        row.dataset.url = url

        // Favicon image. If the site's icon fails to load (some tabs
        // have none), swap in a bundled placeholder image
        const favicon = document.createElement("img")
        favicon.className = "tab-favicon"
        favicon.src = tabData.iconURL || "icons/empty-website-logo.png"
        favicon.alt = ""   // decorative: the title text sits right beside it
        favicon.onerror = () => {
            favicon.onerror = null   // stop, so a missing fallback can't loop forever
            favicon.src = "icons/empty-website-logo.png"
        }

        // Title text. textContent (not innerHTML) so a page title
        // containing HTML can't inject markup into the popup
        const title = document.createElement("span")
        title.className = "tab-title"
        title.textContent = tabData.title || url

        // Delete button ("×"). Hidden until the row is hovered (CSS handles
        // the reveal). No click handler here on purpose — you'll add the
        // listener; read del.dataset.url (or row.dataset.url) to know which
        // tab to remove.
        const del = document.createElement("button")
        del.type = "button"
        del.className = "tab-delete"
        del.textContent = "×"   // × (multiplication sign) — a clean, centered X
        del.setAttribute("aria-label", "Delete saved tab")
        del.dataset.url = url
        
        // Clickable "open" area: favicon + title live inside a <button>.
        // This is the element you'll wire to open the tab. It's a SIBLING of
        // the delete button (not its parent), so the two never interfere.
        const open = document.createElement("button")
        open.type = "button"
        open.className = "tab-open"
        open.dataset.url = url   // your open handler reads this
        open.appendChild(favicon)
        open.appendChild(title)

        // Assemble: [open button] + [delete button] into the row, row into list
        row.appendChild(open)
        row.appendChild(del)

        if (tabData.folder === "None") {
            list.appendChild(row)
        } else {
            // Route the tab straight into its folder's .folder-tabs box 
            const folderTabs = list.querySelector(`.folder-tabs[data-folder="${tabData.folder}"]`)
            if (folderTabs) {
                folderTabs.appendChild(row)
            } else {
                console.warn(`No folder box for: ${tabData.folder}`)
            }
        }

        
    }
}

function buildFolders(listOfFolders, list){
    // Render a component per folder (icon + name, clickable, deletable).
    // Folders render FIRST so they show even when there are no saved tabs.
    for (const folderName of listOfFolders) {
        const folderRow = document.createElement("div")
        folderRow.className = "folder-row collapsed"   // start collapsed (matches the closed icon)

        // Clickable header (icon + name). data-folder tells your handler
        // which folder was clicked (parallel to a tab's data-url).
        const folderHeader = document.createElement("button")
        folderHeader.type = "button"
        folderHeader.className = "folder-header"
        folderHeader.dataset.folder = folderName

        const folderIcon = document.createElement("img")
        folderIcon.className = "folder-icon"
        folderIcon.src = "icons/closed-folder.svg"
        folderIcon.alt = ""

        const folderLabel = document.createElement("span")
        folderLabel.className = "folder-name"
        folderLabel.textContent = folderName

        folderHeader.appendChild(folderIcon)
        folderHeader.appendChild(folderLabel)

        // Delete "×" — mirrors the tab delete, but carries data-folder
        // (not data-url) so your handler routes it to folder deletion.
        const folderDelete = document.createElement("button")
        folderDelete.type = "button"
        folderDelete.className = "folder-delete"
        folderDelete.textContent = "×"
        folderDelete.setAttribute("aria-label", "Delete folder")
        folderDelete.dataset.folder = folderName

        // For adding tabs that are assigned to the current folder
        const folderTabs = document.createElement("div")
        folderTabs.className = "folder-tabs"
        folderTabs.dataset.folder = folderName   // lets buildSavedTabs route tabs straight here

        // Header + delete share one horizontal line; folder-tabs sits below it
        const folderTop = document.createElement("div")
        folderTop.className = "folder-top"
        folderTop.appendChild(folderHeader)
        folderTop.appendChild(folderDelete)

        folderRow.appendChild(folderTop)
        folderRow.appendChild(folderTabs)

        list.appendChild(folderRow)
    }
}