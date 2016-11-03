// Define the application shell
import React, { PropTypes, Component } from 'react';

class AppShell extends Component {
  static propTypes = {
    children: PropTypes.element
  }

  render() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}

export default AppShell;

