# 📋 Colonist Companion – Task List

> 🎯 This is the initial breakdown of features and steps to build the Colonist Companion Chrome Extension.

---

## ✅ Phase 1: Core Infrastructure

- [ ] Create boilerplate popup and background service worker
- [ ] Add content script to inject logic into Colonist.io game

---

## 🕹️ Phase 2: Game Log Scraping

- [ ] Identify and select the play log container
- [ ] Implement scroll logic to fetch the entire play history
- [ ] Extract full DOM elements for analysis (not just text)
- [ ] Store parsed entries for processing and rehydration after refresh

---

## 📊 Phase 3: Dice Roll Statistics

- [ ] Parse dice roll events from log
- [ ] Maintain frequency map for dice values (2–12)
- [ ] Create visual overlay (popup or DOM injected) to display histogram or roll percentages

---

## 🃏 Phase 4: Player Resource Tracking

- [ ] Parse logs to track when players gain/lose cards
- [ ] Estimate resources by type per player
- [ ] Update UI overlay as new logs appear

---

## 🔁 Phase 5: Live Updates + State Tracking

- [ ] Use `MutationObserver` to detect new log entries
- [ ] Recalculate dice stats and card estimates live
- [ ] Ensure it works both from refresh and during active play

---

## 🧪 Phase 6: Testing and Refinement

- [ ] Test across multiple game scenarios (4P, bots, custom rules)
- [ ] Handle edge cases (trades, 7 discards, dev cards)
- [ ] Optimize for performance and prevent memory leaks

---

## 🌐 Optional Polish

- [ ] Add nice UI in popup or floating div
- [ ] Add user options (reset stats, toggle features)
- [ ] Add branding/logo for **fun**

---

## 🚀 Future Ideas

- [ ] Highlight robbery targets
- [ ] Suggest best placements based on dice stats
- [ ] Export game stats
