// Tests básicos para utilidades
import { validateImageFormat, imageToBase64 } from '../utils/imageUtils';
import { validateImageFile, validateParameters } from '../utils/validation';

describe('Utilidades de Imagen', () => {
  describe('validateImageFormat', () => {
    it('debe aceptar archivos JPG', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      expect(validateImageFormat(file)).toBe(true);
    });

    it('debe aceptar archivos PNG', () => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      expect(validateImageFormat(file)).toBe(true);
    });

    it('debe aceptar archivos WEBP', () => {
      const file = new File([''], 'test.webp', { type: 'image/webp' });
      expect(validateImageFormat(file)).toBe(true);
    });

    it('debe rechazar archivos que no sean imágenes', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' });
      expect(validateImageFormat(file)).toBe(false);
    });
  });

  describe('validateImageFile', () => {
    it('debe validar archivo correcto', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it('debe rechazar archivo sin tipo', () => {
      const result = validateImageFile(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('validateParameters', () => {
    it('debe validar parámetros completos', () => {
      const params = {
        intensidadGourmet: 5,
        estiloPlato: 'moderno',
        iluminacion: 'natural',
        fondo: 'blanco',
        anguloCamara: '45'
      };
      const result = validateParameters(params);
      expect(result.valid).toBe(true);
    });

    it('debe rechazar parámetros incompletos', () => {
      const params = {
        intensidadGourmet: 5
      };
      const result = validateParameters(params);
      expect(result.valid).toBe(false);
    });

    it('debe validar rango de intensidad', () => {
      const params = {
        intensidadGourmet: 15, // Fuera de rango
        estiloPlato: 'moderno',
        iluminacion: 'natural',
        fondo: 'blanco',
        anguloCamara: '45'
      };
      const result = validateParameters(params);
      expect(result.valid).toBe(false);
    });
  });
});

