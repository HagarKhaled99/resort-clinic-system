import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PatientForm from './PatientForm';

test('renders Patient Registration form', () => {
  render(<PatientForm />);
  expect(screen.getByRole('heading', { name: /Patient Registration/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/First name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Last name/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Save patient/i })).toBeInTheDocument();
});

test('toggles language between English and Arabic', () => {
  render(<PatientForm />);
  const langButton = screen.getByRole('button', { name: /change language/i });
  expect(screen.getByRole('heading', { name: /Patient Registration/i })).toBeInTheDocument();

  fireEvent.click(langButton);
  expect(screen.getByRole('heading', { name: /تسجيل مريض جديد/i })).toBeInTheDocument();

  fireEvent.click(langButton);
  expect(screen.getByRole('heading', { name: /Patient Registration/i })).toBeInTheDocument();
});

test('submits form and displays success message', () => {
  render(<PatientForm />);
  const submitButton = screen.getByRole('button', { name: /Save patient/i });
  fireEvent.click(submitButton);

  expect(screen.getByText(/Demo patient profile saved in this page/i)).toBeInTheDocument();
});
