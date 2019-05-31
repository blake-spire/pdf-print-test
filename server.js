const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const pdf = require("dynamic-html-pdf");
const puppeteer = require("puppeteer");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const Handlebars = require("handlebars");

app.use(express.static(path.join(__dirname, "build")));

// components
const CanvasElement = require("./src/CanvasElement").default;

// create prints directory if doesn't exist
const printDir = __dirname + "/prints";
if (!fs.existsSync(printDir)) {
  fs.mkdirSync(printDir);
}

app.get("/api/print", async (req, res) => {
  let fileCount = 0;
  fs.readdir(printDir, (err, files) => {
    fileCount = files.length;
  });

  // get html string
  const HTMLString = ReactDOMServer.renderToString(
    <CanvasElement red="rgb(200, 0, 0)" blue="rgba(0, 0, 200, 0.5)" />
  );

  const source = fs.readFileSync(`${__dirname}/templates/pdf.html`, `utf8`);
  const template = Handlebars.compile(source);
  const context = {
    HTMLString,
  };
  const html = template(context);

  /* PUPPETEER CODE */
  // launch browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle2" });

  // close browser
  await browser.close();

  res.status(200).send("success");

  // PDF CONFIG
  // const options = {
  //   format: "letter",
  //   orientation: "portrait",
  //   border: "10mm",
  // };
  // const document = {
  //   template: source,
  //   context: {
  //     base64String,
  //   },
  //   path: `${printDir}/${fileCount}.pdf`,
  // };

  // pdf
  //   .create(document, options)
  //   .then(({ filename }) => {
  //     res.status(200).send(filename);
  //   })
  //   .catch(err => console.log(err));
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080);
