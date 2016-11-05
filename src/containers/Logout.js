import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { deauthenticate } from '../actions';
import { localStorage } from '../utils';

class Logout extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    location: PropTypes.object,
    deauthenticate: PropTypes.func
  }

  componentDidMount() {
    localStorage.remove('token');
    this.props.deauthenticate();
    this.context.router.push('/');
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default connect(null, { deauthenticate })(Logout);
