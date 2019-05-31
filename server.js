const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const pdf = require("dynamic-html-pdf");
const puppeteer = require("puppeteer");

app.use(express.static(path.join(__dirname, "build")));

// create prints and screenshot directory if doesn't exist
const printDir = __dirname + "/prints";
const screenshotDir = __dirname + "/screenshots";
[printDir, screenshotDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

app.get("/api/print", async (req, res) => {
  let fileCount = 0;
  fs.readdir(printDir, (err, files) => {
    fileCount = files.length;
  });

  // puppeteer code
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
  // get canvas and dimensions
  const canvas = await page.$("#canvas");
  const canvasDimensions = await canvas.boundingBox();
  // get screenshot as base64 string
  const base64String = await page.screenshot({
    clip: canvasDimensions,
    encoding: "base64",
  });
  // close browser
  await browser.close();

  // PDF CONFIG
  const template = fs.readFileSync(`${__dirname}/templates/pdf.html`, `utf8`);
  const document = {
    template,
    context: {
      base64String,
    },
    path: `${printDir}/${fileCount}.pdf`,
  };

  const options = {
    format: "letter",
    orientation: "portrait",
    border: "10mm",
  };

  pdf
    .create(document, options)
    .then(({ filename }) => {
      res.status(200).send(filename);
    })
    .catch(err => console.log(err));
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080);
