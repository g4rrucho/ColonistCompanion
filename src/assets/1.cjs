const util = require('util');
const exec = util.promisify(require('child_process').exec);

const urls = [
  "https://cdn.colonist.io/dist/assets/card_brick.5950ea07a7ea01bc54a5.svg",
  "https://cdn.colonist.io/dist/assets/card_grain.09c9d82146a64bce69b5.svg",
  "https://cdn.colonist.io/dist/assets/card_lumber.cf22f8083cf89c2a29e7.svg",
  "https://cdn.colonist.io/dist/assets/card_ore.117f64dab28e1c987958.svg",
  "https://cdn.colonist.io/dist/assets/card_wool.17a6dea8d559949f0ccc.svg",
  "https://cdn.colonist.io/dist/assets/card_devcardback.92569a1abd04a8c1c17e.svg",
  "https://cdn.colonist.io/dist/assets/card_knight.a58573f2154fa93a6319.svg",
];

// TODO run curl to download thse files
const main = async () => {
  for(const url of urls) {
    const fileName = url.split("/").pop();
    if (fileName) {
      const filePath = `./${fileName}`;
      console.log(`Path: ${filePath}`);
      await exec(`curl -o ${filePath} ${url}`);
    }
  }
}

main()
