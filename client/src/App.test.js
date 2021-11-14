import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const sectionsMenu = screen.getByText("Sections");
  expect(sectionsMenu).toBeInTheDocument();
});
