import { NextRequest, NextResponse } from 'next/server';

/**
 * API para obtener todas las inspecciones
 * Esta API se ejecuta en el servidor pero no tiene acceso a Firebase directamente
 * Los datos deben estar disponibles en el cliente a través de localStorage
 */
export async function GET(request: NextRequest) {
  try {
    // En esta versión sin Firebase, la API simulará una respuesta
    // Los datos reales los manejará el cliente desde localStorage
    return NextResponse.json({
      success: true,
      data: [],
      message: 'Los datos se cargarán desde localStorage en el cliente',
      info: 'API simulada - los datos reales están en localStorage'
    });
    
  } catch (error: any) {
    console.error('Error al obtener inspecciones:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 