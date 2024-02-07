import { describe, expect, vi, test } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../context/UserInfoContext/UserInfoContext';
import { MantineProvider } from '@mantine/core';
import Login from '../pages/Login/Login';
import '@testing-library/jest-dom';

describe('Login Page', () => {
  test('should render email and password input fields and submit button', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <MantineProvider>
          <UserProvider>
            <Login />
          </UserProvider>
        </MantineProvider>
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('should show validation error if email is invalid', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <MantineProvider>
          <UserProvider>
            <Login />
          </UserProvider>
        </MantineProvider>
      </MemoryRouter>
    );
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'invalidemail' } });
    fireEvent.submit(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
    });
  });

  test('should handle form submission successfully', async () => {
    // Mock Axios pour une réponse API réussie avec data
    vi.spyOn(axios, 'post').mockResolvedValue({
      data: {
        response: {
          user_id: 32,
          firstname: 'Pika',
          family_id: 8,
          role: 'admin',
        },
        token: 'abcdef12345',
      },
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <MantineProvider>
          <UserProvider>
            <Login />
          </UserProvider>
        </MantineProvider>
      </MemoryRouter>
    );

    // Simule la saisie de l'email et du mot de passe
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'pika@mail.com' } });
    fireEvent.input(screen.getByLabelText(/Mot de passe/i), { target: { value: 'Test2024!' } });

    // Simule la soumission du formulaire
    fireEvent.submit(screen.getByTestId('submit-button'));

    // Vérifie que la requête axios.post a bien été faite
    expect(axios.post).toHaveBeenCalledTimes(1);

    // Nettoie le mock
    vi.restoreAllMocks();
  });
});
