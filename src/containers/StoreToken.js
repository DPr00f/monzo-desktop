import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../actions';
import { localStorage } from '../utils';

class StoreToken extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    location: PropTypes.object,
    authenticate: PropTypes.func
  }

  componentDidMount() {
    localStorage.set('token', this.props.location.query.token);
    this.props.authenticate();
    this.context.router.push('/');
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default connect(null, { authenticate })(StoreToken);
