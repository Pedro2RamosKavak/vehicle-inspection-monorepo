'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Definir la interfaz para la estructura de una inspección
interface Inspeccion {
  id: string;
  titular: string;
  placa: string;
  email: string;
  submissionDate: string;
}

export default function InspeccionesList() {
  const [inspecciones, setInspecciones] = useState<Inspeccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInspecciones() {
      try {
        // Primero intentamos obtener las inspecciones del localStorage
        const localStorageInspections = localStorage.getItem('inspecciones');
        let localInspecciones: Inspeccion[] = [];
        
        if (localStorageInspections) {
          try {
            const parsedInspections = JSON.parse(localStorageInspections);
            localInspecciones = parsedInspections.map((insp: any) => ({
              id: insp.id,
              titular: insp.titular || insp.ownerName || 'Sin nombre',
              placa: insp.placa || insp.licensePlate || 'Sin placa',
              email: insp.email || 'Sin email',
              submissionDate: insp.submissionDate || new Date().toISOString()
            }));
            console.log('Inspecciones encontradas en localStorage:', localInspecciones.length);
          } catch (err) {
            console.error('Error al analizar inspecciones del localStorage:', err);
          }
        }
        
        // Luego intentamos obtener las inspecciones de la API
        const response = await fetch('/api/inspecciones');
        
        if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Error desconocido al obtener las inspecciones');
        }
        
        // Si la API devuelve datos usarlos, sino usar solo localStorage
        // Esto es solo para compatibilidad, la API actual devuelve [] en data
        const apiInspecciones = result.data || [];
        console.log('Respuesta de API:', result);
        
        // Ordenar por fecha de envío (más reciente primero)
        localInspecciones.sort((a, b) => 
          new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
        );
        
        setInspecciones(localInspecciones);
      } catch (err: any) {
        console.error('Error al obtener inspecciones:', err);
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    }

    fetchInspecciones();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Cargando inspecciones...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
        <Link href="/" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver al Inicio
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">Inspecciones de Vehículos</h1>
      
      {inspecciones.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-600">No hay inspecciones disponibles.</p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titular
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placa
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inspecciones.map((inspeccion) => (
                  <tr key={inspeccion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {inspeccion.titular}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inspeccion.placa}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inspeccion.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(inspeccion.submissionDate).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/inspecciones/${inspeccion.id}`} className="text-blue-600 hover:text-blue-900">
                        Ver detalles
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 