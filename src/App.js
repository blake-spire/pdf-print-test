import React, { Component } from "react";
import CanvasElement from "./CanvasElement";
import axios from "axios";

class App extends Component {
  handleClick = e => {
    console.log("hii");
    axios.get("api/print");
  };

  render() {
    return (
      <section>
        <h1>SSR-TEST</h1>
        <button onClick={this.handlePrint}>EXPORT CANVAS ELEMENT AS PDF</button>
        <CanvasElement />
      </section>
    );
  }
}

export default App;
