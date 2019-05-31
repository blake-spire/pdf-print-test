import React, { Component } from "react";
import CanvasElement from "./CanvasElement";
import axios from "axios";
import PrintJS from "print-js/src/index.js";

class App extends Component {
  handleClick = () => {
    axios
      .get("api/print")
      .then(({ data: filename }) => {
        PrintJS({
          printable: filename,
          type: "pdf",
          showModal: true,
        });
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
