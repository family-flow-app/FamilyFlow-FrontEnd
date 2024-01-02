// File Name: Home.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

// Créer un mock pour useNavigate
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('Home Component', () => {
  it('should render the home page correctly', () => {
    render(<Home />, { wrapper: MemoryRouter });

    // Vérifier si le titre est présent
    expect(screen.getByText('Connecte ta famille')).toBeInTheDocument();

    // Vérifier si les boutons sont présents
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should navigate to signup page on sign in button click', () => {
    render(<Home />, { wrapper: MemoryRouter });

    // Simuler un clic sur le bouton Sign In
    fireEvent.click(screen.getByText('Sign In'));

    // Vérifier si la navigation a été appelée avec le bon chemin
    expect(mockedNavigate).toHaveBeenCalledWith('/signup');
  });

  it('should navigate to login page on login button click', () => {
    render(<Home />, { wrapper: MemoryRouter });

    // Simuler un clic sur le bouton Login
    fireEvent.click(screen.getByText('Login'));

    // Vérifier si la navigation a été appelée avec le bon chemin
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });
});
