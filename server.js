const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const pdf = require("dynamic-html-pdf");
const puppeteer = require("puppeteer");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const Handlebars = require("handlebars");

app.use('/public', express.static(path.join(__dirname, "dist")));

// components
const CanvasElement = require("./src/common/CanvasElement").default;

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

  const source = fs.readFileSync(`${__dirname}/templates/react.html`, `utf8`);
  const template = Handlebars.compile(source);
  const context = {
    script: fs.readFileSync(`${__dirname}/dist/server.js`, `utf8`),
  };
  const html = template(context);

  /* PUPPETEER CODE */
  // launch browser
  let base64String;

  try {
    const browser = await puppeteer.launch({
      /** @todo setup sandbox */
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE:', msg.text(), msg));
    
    // load html
    await page.setContent(html, { waitUntil: "networkidle2" });

    /** @todo wait for someting else */
    await page.waitFor(1000 * 2);

    /**
     * Evaluate a script in the context of a page
     * 'renderComponent' is attached to window by the server's App script
     * only seems to work with serializable parameers (not able to pass component classes directly)
     */
    await page.evaluate(() => {
      renderComponent({
        red: 'rgb(200, 0, 0)',
        blue: 'rgba(0, 0, 200, 0.5)',
      }, document.getElementById('root'));
    });

    /**
     * @todo server's App.js component should set a class to indicate the inner Component as been loaded
     * (expect the common Component to have an 'onLoaded' prop)
    */
    await page.waitFor(1000 * 2);

    // take screenshot
    const element = await page.$("#root");
    const clip = await element.boundingBox();

    base64String = await page.screenshot({
      clip,
      encoding: "base64",
    });

    // close browser
    await browser.close();
  } catch (error) {
    console.log("error in puppeteer", error);
  }

  // PDF CONFIG
  const PDFTemplate = fs.readFileSync(
    `${__dirname}/templates/pdf.html`,
    `utf8`
  );
  const options = {
    format: "letter",
    orientation: "portrait",
    border: "10mm",
  };
  const document = {
    template: PDFTemplate,
    context: {
      base64String,
      fileCount,
    },
    /** @todo Fix this. broke this by changing express static server path? */
    path: `${printDir}/${fileCount}.pdf`,
  };

  pdf
    .create(document, options)
    .then(({ filename }) => {
      res.status(200).send(filename);
    })
    .catch(err => console.log(err));
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(process.env.PORT || 8080);
