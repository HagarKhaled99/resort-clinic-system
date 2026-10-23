import React from 'react';
import { render, screen } from '@testing-library/react';
import Statistics from './Statistics';

test('renders Monthly Statistics header and key metrics', () => {
  render(<Statistics />);
  expect(screen.getByRole('heading', { name: /Monthly Statistics/i })).toBeInTheDocument();
  expect(screen.getByText('Total Patients')).toBeInTheDocument();
  expect(screen.getByText('Clinical Encounters')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Patient Visits/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Encounter Breakdown/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Recent Clinical Activity/i })).toBeInTheDocument();
});
