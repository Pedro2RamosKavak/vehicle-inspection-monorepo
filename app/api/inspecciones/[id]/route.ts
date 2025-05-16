import { NextRequest, NextResponse } from 'next/server';

/**
 * API para obtener una inspección por ID
 * Esta API se ejecuta en el servidor pero no tiene acceso a Firebase directamente
 * Los datos deben estar disponibles en el cliente a través de localStorage
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Asegurarse de que params.id esté disponible (corrección para Next.js 15+)
    if (!params?.id) {
      return NextResponse.json(
        { success: false, error: 'ID de inspección no proporcionado' },
        { status: 400 }
      );
    }
    
    const id = params.id;
    
    // En esta versión sin Firebase, la API simulará una respuesta
    // Los datos reales los manejará el cliente desde localStorage
    return NextResponse.json({
      success: true,
      data: {
        id: id,
        message: 'Los datos se cargarán desde localStorage en el cliente',
        info: 'API simulada - los datos reales están en localStorage'
      }
    });
    
  } catch (error: any) {
    console.error('Error al obtener inspección:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 