const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "build")));

app.get("/api/print", function(req, res) {
  console.log("hiii");
  return res.send("pong");
});

app.get("/", function(req, res) {
  console.log("hmmm");
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080);
