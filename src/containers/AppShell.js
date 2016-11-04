// Define the application shell
import React, { PropTypes, Component } from 'react';

class AppShell extends Component {
  static propTypes = {
    children: PropTypes.element
  }

  render() {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>Monzo Desktop</title>
          <link type="text/css" rel="stylesheet" href="dist/main.css" />
        </head>
        <body>
          { this.props.children }
          <script async type="application/javascript" src="dist/bundle.js"></script>
        </body>
      </html>
    );
  }
}

export default AppShell;

