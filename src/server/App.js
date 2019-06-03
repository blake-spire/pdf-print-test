import React, { Component } from "react";
import { render } from 'react-dom'
import CanvasElement from '../common/CanvasElement';

/**
 * Entrypoint for SSR. Runs in headless browser
 * 
 * Just renders the Component passed in props
 */
class App extends Component {
  render() {
		const { ...props } = this.props;

    return (
      <section>
        <CanvasElement {...props} />
      </section>
    );
  }
}

function renderComponent(props, domNode) {
	return render(<App {...props} />, domNode);
}

window.renderComponent = renderComponent;

export default App;
export { renderComponent };
