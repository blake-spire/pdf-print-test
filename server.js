const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const pdf = require("dynamic-html-pdf");
const uuidv4 = require("uuid/v4");

app.use(express.static(path.join(__dirname, "build")));

// create prints directory if doesn't exist
const dir = __dirname + "/prints";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// components
const CanvasElement = require("./src/CanvasElement").default;

app.get("/api/print", function(req, res) {
  const GUID = uuidv4();
  const HTMLString = ReactDOMServer.renderToString(<CanvasElement />);

  // PDF CONFIG
  const template = fs.readFileSync(`${__dirname}/templates/pdf.html`, `utf8`);
  const document = {
    template,
    context: {
      element: HTMLString,
    },
    path: `${__dirname}/prints/${GUID}.pdf`,
  };

  const options = {
    format: "letter",
    orientation: "portrait",
    border: "10mm",
  };

  pdf
    .create(document, options)
    .then(response => {
      res.setHeader(
        "Content-disposition",
        'inline; filename="' + response.filename + '"'
      );
      res.setHeader("Content-type", "application/pdf");
      res.status(200).sendFile(response.filename);
    })
    .catch(err => console.log(err));
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080);
