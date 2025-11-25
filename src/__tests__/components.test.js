// Tests básicos para componentes
import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../components/Layout';
import ImageUploader from '../components/ImageUploader';
import ParameterPanel from '../components/ParameterPanel';

describe('Componentes', () => {
  describe('Layout', () => {
    it('debe renderizar el header con logo', () => {
      render(
        <Layout>
          <div>Test content</div>
        </Layout>
      );
      expect(screen.getByText(/GourmetAI/i)).toBeInTheDocument();
    });
  });

  describe('ImageUploader', () => {
    it('debe renderizar el área de carga', () => {
      const mockOnSelect = jest.fn();
      render(<ImageUploader onImageSelect={mockOnSelect} />);
      expect(screen.getByText(/Arrastra una imagen aquí/i)).toBeInTheDocument();
    });

    it('debe mostrar preview cuando hay imagen seleccionada', () => {
      const mockOnSelect = jest.fn();
      const testImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';
      render(<ImageUploader onImageSelect={mockOnSelect} selectedImage={testImage} />);
      expect(screen.getByAltText(/Imagen seleccionada/i)).toBeInTheDocument();
    });
  });

  describe('ParameterPanel', () => {
    const mockParameters = {
      intensidadGourmet: 5,
      estiloPlato: 'moderno',
      iluminacion: 'natural',
      fondo: 'blanco',
      decoracionesExtra: [],
      anguloCamara: '45'
    };

    it('debe renderizar todos los controles de parámetros', () => {
      const mockOnChange = jest.fn();
      const mockOnGenerate = jest.fn();
      
      render(
        <ParameterPanel
          parameters={mockParameters}
          onParameterChange={mockOnChange}
          onGenerate={mockOnGenerate}
          isGenerating={false}
        />
      );
      
      expect(screen.getByText(/Parámetros de Generación/i)).toBeInTheDocument();
      expect(screen.getByText(/Generar Gourmet/i)).toBeInTheDocument();
    });

    it('debe deshabilitar controles durante generación', () => {
      const mockOnChange = jest.fn();
      const mockOnGenerate = jest.fn();
      
      render(
        <ParameterPanel
          parameters={mockParameters}
          onParameterChange={mockOnChange}
          onGenerate={mockOnGenerate}
          isGenerating={true}
        />
      );
      
      const generateButton = screen.getByText(/Generando/i);
      expect(generateButton).toBeDisabled();
    });
  });
});

