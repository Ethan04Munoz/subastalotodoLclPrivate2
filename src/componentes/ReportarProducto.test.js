import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';  // Importa MemoryRouter
import ReportarProducto from './ReportarProducto';
import axios from './axiosConfig';

jest.mock('./axiosConfig', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('ReportarProducto', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ status: 200 });
    axios.post.mockResolvedValue({ data: 'Se realizo el reporte con exito.' });
  });

  test('el formulario se carga en menos de 3 segundos', async () => {
    const t0 = performance.now();

    // Envuelve tu componente con MemoryRouter
    render(
      <MemoryRouter>
        <ReportarProducto />
      </MemoryRouter>
    );

    const t1 = performance.now();
    const tiempoCarga = t1 - t0;

    expect(tiempoCarga).toBeLessThan(3000);
  });
});
