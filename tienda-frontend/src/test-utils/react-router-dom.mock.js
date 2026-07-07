const React = require("react");

module.exports = {
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ children }) => children,
  useLocation: () => ({ pathname: "/" }),
  useNavigate: () => jest.fn(),
  Link: ({ children }) => children,
  NavLink: ({ children }) => children,
};
