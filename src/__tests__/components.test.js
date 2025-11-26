// Tests básicos para componentes
import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../components/Layout';
import ImageUploader from '../components/ImageUploader';

// Mock del ThemeContext para Layout
jest.mock('../context/ThemeContext', () => ({
  useColorMode: () => ({ toggleColorMode: jest.fn(), mode: 'light' })
}));

describe('Componentes', () => {
  describe('Layout', () => {
    it('debe renderizar el header con logo', () => {
      render(
        <Layout>
          <div>Test content</div>
        </Layout>
      );
      // Puede haber múltiples "GourmetAI"
      expect(screen.getAllByText(/GourmetAI/i).length).toBeGreaterThan(0);
    });

    it('debe renderizar el contenido children', () => {
      render(
        <Layout>
          <div>Contenido de prueba</div>
        </Layout>
      );
      expect(screen.getByText(/Contenido de prueba/i)).toBeInTheDocument();
    });
  });

  describe('ImageUploader', () => {
    it('debe renderizar el área de carga', () => {
      const mockOnSelect = jest.fn();
      render(<ImageUploader onImageSelect={mockOnSelect} />);
      // Buscar texto que existe en el componente
      expect(screen.getByText(/Sube tu plato aquí/i)).toBeInTheDocument();
    });

    it('debe tener input de archivo', () => {
      const mockOnSelect = jest.fn();
      render(<ImageUploader onImageSelect={mockOnSelect} />);
      const fileInput = document.getElementById('image-upload-input');
      expect(fileInput).toBeInTheDocument();
    });

    it('debe mostrar preview cuando hay imagen seleccionada', () => {
      const mockOnSelect = jest.fn();
      const testImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';
      render(<ImageUploader onImageSelect={mockOnSelect} selectedImage={testImage} />);
      expect(screen.getByAltText(/Imagen seleccionada/i)).toBeInTheDocument();
    });
  });
});

