// Define the application shell
import React, { PropTypes } from 'react';

const AppShell = ({ children }) => (
  <div>
    { children }
  </div>
);

AppShell.propTypes = {
  children: PropTypes.element,
};

export default AppShell;

