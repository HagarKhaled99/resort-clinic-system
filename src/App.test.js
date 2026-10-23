import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('react-router-dom', () => {
  return {
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: ({ element }) => <div>{element}</div>,
    Navigate: () => <div>Navigate Mock</div>,
    NavLink: ({ children }) => <a>{children}</a>,
    Outlet: () => <div>Outlet Mock</div>,
    useLocation: () => ({ pathname: '/dashboard' }),
    useNavigate: () => jest.fn(),
  };
});

import App from './App';

test('renders App without crashing', () => {
  render(<App />);
});
