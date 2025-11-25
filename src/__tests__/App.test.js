// Tests básicos para el componente App
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock de los servicios antes de importar App
jest.mock('../services/geminiService', () => ({
  analyzeImage: jest.fn(),
  generateGourmetVariants: jest.fn()
}));

jest.mock('../services/airtableService', () => ({
  saveGeneration: jest.fn(),
  getHistory: jest.fn()
}));

import App from '../App';

describe('App Component', () => {
  it('debe renderizar sin errores', () => {
    render(<App />);
    expect(screen.getByText(/GourmetAI/i)).toBeInTheDocument();
  });

  it('debe mostrar el panel de carga de imagen', () => {
    render(<App />);
    expect(screen.getByText(/Arrastra una imagen aquí/i)).toBeInTheDocument();
  });

  it('debe mostrar el panel de parámetros', () => {
    render(<App />);
    expect(screen.getByText(/Parámetros de Generación/i)).toBeInTheDocument();
  });
});

