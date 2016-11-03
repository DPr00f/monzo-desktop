import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

class Home extends Component {
  static propTypes = {
    authenticated: PropTypes.bool
  }

  renderLoginButton() {
    if (!this.props.authenticated) {
      return (
        <a href="/monzoLogin">Login with monzo</a>
      );
    }
  }

  renderLogged() {
    if (!this.props.authenticated) {
      return;
    }
    return (
      <span>weee, we're logged in</span>
    );
  }

  render() {
    return (
      <div className="homePage">
        { this.renderLoginButton() }
        { this.renderLogged() }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { authenticated: state.authenticated };
}

export default connect(mapStateToProps)(Home);
