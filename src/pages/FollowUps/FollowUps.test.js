

import { render, screen, fireEvent } from '@testing-library/react';
import FollowUps from './FollowUps';
import { todayISO } from '../../data/mockData';

beforeEach(() => localStorage.clear());

test('displays follow-up appointments', () => {
  render(<FollowUps />);
  expect(screen.getByText('Ivan Petrov')).toBeInTheDocument();
  expect(screen.getByText('Sara Hassan')).toBeInTheDocument();
});

test('filters upcoming appointments', () => {
  render(<FollowUps />);
  fireEvent.click(screen.getByRole('button', { name: 'Upcoming' }));

  expect(screen.getByText('Anna Müller')).toBeInTheDocument();
  expect(screen.queryByText('Ivan Petrov')).not.toBeInTheDocument();
});

test('changes appointment status', () => {
  render(<FollowUps />);

  fireEvent.change(screen.getByLabelText('Change status for Ivan Petrov'), {
    target: { value: 'Completed' }
  });

  fireEvent.click(screen.getByRole('button', { name: 'Completed' }));

  expect(screen.getByText('Ivan Petrov')).toBeInTheDocument();
  expect(screen.queryByText('Sara Hassan')).not.toBeInTheDocument();
});

test('adds a new follow-up', () => {
  render(<FollowUps />);

  fireEvent.click(screen.getByRole('button', { name: /new follow-up/i }));

  fireEvent.change(screen.getByLabelText('Patient'), {
    target: { value: '5' }
  });
  fireEvent.change(screen.getByLabelText('Date'), {
    target: { value: todayISO() }
  });
  fireEvent.change(screen.getByLabelText('Time'), {
    target: { value: '14:00' }
  });
  fireEvent.change(screen.getByLabelText('Reason for follow-up'), {
    target: { value: 'Recovery check' }
  });

  fireEvent.click(screen.getByRole('button', { name: 'Add follow-up' }));

  expect(screen.getByText('Recovery check')).toBeInTheDocument();
});

test('saves appointment status after reload', () => {
  const { unmount } = render(<FollowUps />);

  fireEvent.change(screen.getByLabelText('Change status for Ivan Petrov'), {
    target: { value: 'Completed' }
  });

  unmount();
  render(<FollowUps />);

  expect(screen.getByLabelText('Change status for Ivan Petrov'))
    .toHaveValue('Completed');
});
