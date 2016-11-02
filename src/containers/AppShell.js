// Define the application shell
import React, { PropTypes } from 'react';

class AppShell extends React.Component {
  static get propTypes() {
    return {
      children: PropTypes.element
    };
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

