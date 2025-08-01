# 🧠 Colonist Companion

A smart Chrome extension that enhances your [Colonist.io](https://colonist.io) gameplay with real-time stats, resource tracking, and log parsing.

> ⚠️ Unofficial fan-made tool. Not affiliated with Colonist.io. Built for fun, learning, and improving your Settlers strategy. You might also get an **little** edge on your oponents 😜

---

## ✨ Features

- 🃏 **Track Cards Like Never Before**  
  See estimated resource and development cards for each player based on game log analysis.

- 🎲 **Dice Roll Statistics**  
  Visualize dice rolls and probabilities to make smarter decisions on placements and trades.

- 🔍 **Live Log Monitoring**  
  Parses the in-game play log to keep your game state updated as the match unfolds.

---

## 📸 Screenshot (Coming Soon)

_(Will include once the UI overlay is ready)_

---

## 🔧 Installation (Dev)

1. Clone the repo

```
git clone https://github.com/YOUR_USERNAME/colonist-companion.git
cd colonist-companion
```

2. Install dependencies

```
yarn install
```

3. Build the extension

```
yarn build
```

4. Load in Chrome  
   - Visit `chrome://extensions`  
   - Enable **Developer Mode**  
   - Click **Load Unpacked** and select the `dist/` folder

---

## 🧪 Tech Stack

- 🧩 **Chrome Extension** (Manifest v3)
- ⚙️ **CRXJS** for bundling
- 🔍 **MutationObserver** for DOM change detection
- 🧠 **Custom parser** for in-game log entries

---

## 🛣️ Roadmap

Check the [GitHub Issues](https://github.com/YOUR_USERNAME/colonist-companion/issues) tab for planned features, bugs, and enhancements.

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

1. Fork this repo  
2. Create a new branch (`feat/my-feature`)  
3. Commit your changes  
4. Push and open a pull request

---

## 📄 License

MIT

---

## 🎉 Acknowledgments

- Huge thanks to [Colonist.io](https://colonist.io) — this project is only possible thanks to the awesome game they built.
