// Tests para utilidades
import { validateImageFile, validateParameters, validateEnvironment } from '../utils/validation';

describe('Validación de Archivos de Imagen', () => {
  it('debe validar archivo JPG válido', () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('debe validar archivo PNG válido', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('debe validar archivo WEBP válido', () => {
    const file = new File(['test'], 'test.webp', { type: 'image/webp' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('debe rechazar archivo nulo', () => {
    const result = validateImageFile(null);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('debe rechazar archivo con tipo inválido', () => {
    const file = new File(['test'], 'test.gif', { type: 'image/gif' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('no válido');
  });

  it('debe rechazar archivo muy grande', () => {
    const largeContent = new Array(11 * 1024 * 1024).fill('a').join('');
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('demasiado grande');
  });
});

describe('Validación de Parámetros', () => {
  const validParams = {
    intensidadGourmet: 5,
    estiloPlato: 'moderno',
    iluminacion: 'natural',
    fondo: 'blanco',
    anguloCamara: '45'
  };

  it('debe validar parámetros completos', () => {
    const result = validateParameters(validParams);
    expect(result.valid).toBe(true);
  });

  it('debe rechazar parámetros incompletos', () => {
    const result = validateParameters({ intensidadGourmet: 5 });
    expect(result.valid).toBe(false);
  });

  it('debe rechazar intensidad menor a 1', () => {
    const result = validateParameters({ ...validParams, intensidadGourmet: 0 });
    expect(result.valid).toBe(false);
  });

  it('debe rechazar intensidad mayor a 10', () => {
    const result = validateParameters({ ...validParams, intensidadGourmet: 15 });
    expect(result.valid).toBe(false);
  });

  it('debe aceptar intensidad en el límite inferior', () => {
    const result = validateParameters({ ...validParams, intensidadGourmet: 1 });
    expect(result.valid).toBe(true);
  });

  it('debe aceptar intensidad en el límite superior', () => {
    const result = validateParameters({ ...validParams, intensidadGourmet: 10 });
    expect(result.valid).toBe(true);
  });

  it('debe validar parámetros opcionales con valores válidos', () => {
    const result = validateParameters({
      ...validParams,
      tipoVajilla: 'bowl',
      colorVajilla: 'negro',
      ambiente: 'restaurante',
      profundidadCampo: 'bokeh-fuerte'
    });
    expect(result.valid).toBe(true);
  });

  it('debe rechazar valores inválidos en parámetros opcionales', () => {
    const result = validateParameters({
      ...validParams,
      tipoVajilla: 'invalido'
    });
    expect(result.valid).toBe(false);
  });
});

describe('Validación de Entorno', () => {
  it('debe retornar estructura correcta', () => {
    const result = validateEnvironment();
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('missing');
  });
});

