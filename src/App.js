import React, { Component } from "react";
import CanvasElement from "./CanvasElement";
import axios from "axios";
import fileDownload from "js-file-download";

class App extends Component {
  handleClick = () => {
    axios
      .get("api/print")
      .then(results => {
        fileDownload(results.data, "print.pdf");
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <section>
        <h1>SSR-TEST</h1>
        <button onClick={this.handleClick}>EXPORT CANVAS ELEMENT AS PDF</button>
        <CanvasElement />
      </section>
    );
  }
}

export default App;
