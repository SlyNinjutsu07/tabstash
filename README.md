# TabStash

TabStash is a Chrome extension for saving tabs you want to get back to later and clearing them out of your window. Save the tab you're on, drop it into a folder to keep things organized, and reopen it whenever you need it — all without losing your place.

## Demo

https://github.com/user-attachments/assets/16ac60ec-508b-48d6-9163-20140de1eadb

## Features

- **Save the current tab** with one click — title, URL, and favicon are captured automatically.
- **Duplicate detection** — saving a tab you've already stashed shows an "Already Saved!" notice instead of creating a copy.
- **Folders** to group saved tabs — create, collapse/expand, and delete them as needed.
- **Drag and drop** tabs into a folder, or back out to the unsorted list.
- **Reopen or delete** any saved tab straight from the popup.
- **Synced storage** — saved tabs and folders are stored with `chrome.storage.sync`, so they follow you across signed-in Chrome instances.

## Installation

TabStash isn't on the Chrome Web Store yet — load it as an unpacked extension:

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the `tabstash` folder.
5. Pin the TabStash icon to your toolbar for quick access.

## Usage

- Click **Save Tab** to stash the tab you're currently viewing.
- Click the folder icon to create a new folder.
- Drag a saved tab onto a folder to file it away; drag it back out to unsort it.
- Click a folder's header to expand or collapse it.
- Click a saved tab to reopen it, or use the delete button to remove it.

## Roadmap

- Semantic search across saved tabs.
- A more advanced backend (Java Spring Boot + PostgreSQL) to replace `chrome.storage.sync`.

## Project structure

```
popup.html / popup.css   – extension popup UI
popup.js                 – state, storage, and event handling
buildui.js                – DOM rendering for tabs and folders
utils.js                  – shared helpers (e.g. URL normalization)
icons/                    – extension and UI icons
manifest.json              – Chrome extension manifest (MV3)
```
