import React, { Component } from "react";

class CanvasElement extends Component {
  componentDidMount() {
    const canvas = document.getElementById("canvas");
    if (canvas.getContext) {
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = this.props.red;
      ctx.fillRect(20, 20, 100, 100);

      ctx.fillStyle = this.props.blue;
      ctx.fillRect(60, 60, 100, 100);
    }
  }

  render() {
    return (
      <section>
        <canvas id="canvas" width="500" height="500" />
      </section>
    );
  }
}

export default CanvasElement;
