import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { localStorage } from '../utils';
import { authenticate, deauthenticate, getAccounts } from '../actions';

class AppShell extends Component {
  static propTypes = {
    children: PropTypes.element,
    authenticated: PropTypes.bool,
    authenticate: PropTypes.func,
    deauthenticate: PropTypes.func,
    getAccounts: PropTypes.func
  }

  componentDidMount() {
    const token = localStorage.get('token');
    if (token && !this.props.authenticated) {
      this.props.authenticate();
    } else if (!token && this.props.authenticated) {
      this.props.deauthenticate();
    }

    if (token && this.props.authenticated) {
      this.props.getAccounts();
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

function mapStateToProps(state) {
  return { authenticated: state.authenticated };
}

export default connect(mapStateToProps, {
  authenticate,
  deauthenticate,
  getAccounts
})(AppShell);

