const express = require("express");
const path = require("path");
const app = express();
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const pdf = require("dynamic-html-pdf");
const uuidv4 = require("uuid/v4");

app.use(express.static(path.join(__dirname, "build")));

// components
const CanvasElement = require("./src/CanvasElement").default;

app.get("/api/print", function(req, res) {
  const GUID = uuidv4();
  const HTMLString = ReactDOMServer.renderToString(<CanvasElement />);

  // PDF CONFIG
  const document = {
    template: "./templates/pdf.html",
    context: {
      element: HTMLString,
    },
    path: `./prints/${GUID}`,
  };

  const options = {
    format: "letter",
    orientation: "portrait",
    border: "10mm",
  };

  pdf
    .create(document, options)
    .then(response => {
      res.status(200).sendFile(response.filename);
    })
    .catch(err => console.log(err));
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080);
