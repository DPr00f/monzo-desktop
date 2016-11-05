import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { localStorage } from '../utils';
import { authenticate, deauthenticate } from '../actions';

class AppShell extends Component {
  static propTypes = {
    children: PropTypes.element,
    authenticate: PropTypes.func,
    deauthenticate: PropTypes.func
  }

  componentDidMount() {
    if (localStorage.get('token')) {
      this.props.authenticate();
    } else {
      this.props.deauthenticate();
    }
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

export default connect(null, {
  authenticate,
  deauthenticate
})(AppShell);

