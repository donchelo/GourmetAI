// Tests básicos para el componente App
import React from 'react';
import { render, screen, act } from '@testing-library/react';

// Mock de los servicios antes de importar App
jest.mock('../services/geminiService', () => ({
  analyzeImage: jest.fn(),
  generateGourmetVariants: jest.fn()
}));

jest.mock('../services/airtableService', () => ({
  saveGeneration: jest.fn(),
  getHistory: jest.fn().mockResolvedValue([])
}));

import App from '../App';

describe('App Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debe renderizar sin errores', async () => {
    await act(async () => {
      render(<App />);
    });
    await act(async () => {
      jest.runAllTimers();
    });
    // Puede haber múltiples "GourmetAI" (header, footer, etc)
    expect(screen.getAllByText(/GourmetAI/i).length).toBeGreaterThan(0);
  });

  it('debe mostrar el panel de carga de imagen', async () => {
    await act(async () => {
      render(<App />);
    });
    await act(async () => {
      jest.runAllTimers();
    });
    expect(screen.getByText(/Sube tu plato/i)).toBeInTheDocument();
  });
});

