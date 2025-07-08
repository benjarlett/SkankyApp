# SkankyApp
🔧 Project Overview

* App Name: SkankyApp
* Platform: iOS (developed using SwiftUI or UIKit)
* Target: iPhone (only for your use via Xcode install)
* Purpose: Quickly play user-uploaded audio loops, optionally in sets

## File locations
* I'm developing this app in the folder ~/Apps/Skanky/
* There is a GEMINI.md file in there. 
* The Xcode project is in ~/Apps/Skanky/SkankyReminders

## 🧱 Core Features
### 1. Audio Loop Library
Upload audio files to the app (via Files, iCloud, or iTunes File Sharing)

Display all uploaded loops in a list ("All" view)

####Each loop has:
* A user-defined title
* Option to play once or loop
* A selector for the Band (who recorded the loop)
* A way of adding loops to existing setlists
* A band (The recording artist of the song)
* Each loop can be added to non, one, or many setlists.
* A place to enter a spotify or youtube link to a recording of the song. 
* A little player that loads either the spotify or youtube if set, embedded, so that it can easily be played during rehearsals. 
* A way to play the loop faster or slower (in semitones) so that a loop can be easily transposed if we are playing it in a different key
* similarly a tune (set in cents) control to play the file slightly faster or slower (some recordings arent quite in tune so this adjutment would be great.

### 2. Playback Controls
	* Tap a loop's row to play/stop (once or looping based on toggle)
	* Stop all loops (implicitly handled by playing another loop)

### 3. Setlist Management
	* Create named Setlists
	* Add any loop to one or more Setlists
	* View Setlists (filter the displayed loops by Setlist)
	* Save and delete Setlists

## 🖼️ UI Overview

### Colours
* Black: #000000
* Yellow: #f7ec0f
* Red: #ed2124
* Green: #68bd45

### Main Views:
#### All Loops:
List of all audio loops.
Filter picker in navigation bar for "All Loops" or specific Setlists.

####Each loop in list:
**Title**
**Band** (smaller, lighter text below title)
Play/Stop button (integrated into the row)
Edit button (pencil icon) to rename or add to Setlist

**Setlists View**
List of saved Setlists
Option to create a new Setlist
Option to delete a Setlist

**Setlist Detail View**
Rename Setlist
List loops in Setlist
Add/Remove loops from Setlist

**Loop Detail/Edit View**
Rename loop (Title)
Assign/remove from Bands (Picker)
Toggle for play mode (loop vs. play once)
"Delete Loop" button with confirmation dialog

**App Settings View**
"Refresh Audio Files" button
"Add Clips from Files App" button (allows adding audio files from iOS Files app or Google Drive)
Band Management section: Add/Remove bands (with confirmation for removal).

## Data Model (JSON Structure)

Loop Data (example):

```json
{
  "loops": [
    {
      "id": "uuid1",
      "title": "Funky Bassline",
      "band": "Groove Masters",
      "filepath": "path/to/file.wav",
      "looping": true,
      "spotifyLink": "spotify:track:...",
      "youtubeLink": "https://www.youtube.com/...",
      "setlists": ["SetlistA", "SetlistB"],
      "transposeSemitones": 0,
      "tuneCents": 0
    },
    {
      "id": "uuid2",
      "title": "Driving Beat",
      "band": "Rhythm Kings",
      "filepath": "path/to/file2.mp3",
      "looping": false,
      "spotifyLink": null,
      "youtubeLink": null,
      "setlists": ["SetlistA"],
      "transposeSemitones": 2,
      "tuneCents": -5
    }
  ],
  "setlists": [
    {"name": "SetlistA", "loopIds": ["uuid1", "uuid2"]},
    {"name": "SetlistB", "loopIds": ["uuid1"]}
  ],
  "bands": ["Groove Masters", "Rhythm Kings"]
}
```

## 🔄 File Management
* Use FileManager to store audio files in app's local documents directory
* Metadata (titles, loop settings, Setlist assignments, bands) stored in a JSON file in the app's local documents directory.
* App supports iTunes File Sharing for adding/removing files via Finder.

## 🔊 Audio Playback
Use AVAudioPlayer for:

* Low-latency playback
* Looping
* Playing multiple loops concurrently (only one plays at a time)

## 🛠️ Tech Stack
* Language: Swift
* Framework: SwiftUI (or UIKit if you prefer)
* Audio: AVFoundation
* Data Storage: JSON files in Documents directory
* App Distribution: Xcode manual install (no App Store needed)

## Development Hardware Summary (2025)

### Mac Mini (M1, 2020)
	•	Model ID: C07HH2WUQ6NY
	•	Chip: Apple M1
	•	Memory: 16 GB Unified RAM
	•	macOS Version: Sequoia 15.5
	•	Xcode Version: 16.4
	•	Developer Tools: Command Line Tools installed
	•	Status: Fully capable of iOS development and running latest Xcode builds with optimal performance

### iPhone SE (3rd Generation)
	•	Model Number: MMXF3B/A
	•	iOS Version: Up to date (iOS 18.x assumed)
	•	Connectivity: Lightning
	•	Developer Mode: Enabled for direct Xcode installation
	•	Status: Fully compatible with current iOS SDKs and perfect for local testing

⸻

## 📦 Development Context
	•	Personal Development Use Only — App will be sideloaded to your personal device via Xcode.
	•	No App Store Distribution Needed
	•	Swift & SwiftUI preferred
	•	Audio Loop Playback App (SkankyReminders) under development

## 📲 Development & Deployment Plan

**Note on Modularization:** While full modularization (separate Xcode projects/Swift packages) is a good long-term goal for larger apps, for this project, we will focus on internal code organization by using more Swift files within the existing project. This improves readability and maintainability without adding immediate build complexity.

### Step 1: Set Up Project
1. Create new iOS app project in Xcode
2. Set bundle identifier, provisioning profile (your Apple ID)

### Step 2: Implement Core Functionality
1. File upload + storage (via Files app/iTunes File Sharing)
2. Audio playback with loop toggle (only one loop plays at a time)
3. Basic UI for list of loops (displaying title and band)

### Step 3: Add Metadata & Setlists
1. Rename/edit loops (title, band, looping setting)
2. Save user preferences (all data persisted to JSON file)
3. Create/view/manage Setlists (add/remove setlists, add/remove loops from setlists)
4. Filter main loop list by Setlist.

### Step 4: Polish UI
1. Icons, layout, accessibility
2. Search/filter options

* ### Step 5: Test on iPhone
1. Run on your iPhone using Xcode
2. Debug and optimize performance

## 🚀 Optional Upgrades Later
* iWatch version for playback loops, filtered by setlist.
* Cloud backup/sync
* Visual waveform display
* Drag-and-drop to reorder loops
* MIDI/External controller support
* macOS Catalyst support for cross-platform use