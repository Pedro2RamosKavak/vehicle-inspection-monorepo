/**
 * Servicio de almacenamiento de inspecciones en el servidor
 * Este archivo contiene funciones que se ejecutan en el servidor para gestionar los datos de inspecciones
 */

import fs from 'fs';
import path from 'path';

// Ruta al directorio de datos
const DATA_DIR = path.join(process.cwd(), 'data');
const INSPECTIONS_FILE = path.join(DATA_DIR, 'inspections.json');

// Asegurar que el directorio de datos exista
export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(INSPECTIONS_FILE)) {
    fs.writeFileSync(INSPECTIONS_FILE, JSON.stringify([]));
  }
}

// Interfaz de inspección
export interface Inspeccion {
  id: string;
  ownerName: string;
  ownerIdentification?: string;
  drivingLicense?: string;
  email: string;
  phone?: string;
  licensePlate: string;
  brand?: string;
  model?: string;
  year?: string;
  color?: string;
  chassisNumber?: string;
  renavam?: string;
  engine_condition?: string;
  body_condition?: string;
  glass_condition?: string;
  tire_condition?: string;
  light_condition?: string;
  general_observations?: string;
  crlv_image_url?: string;
  safety_items_image_url?: string;
  request_id: string;
  submissionDate: string;
}

/**
 * Guarda una nueva inspección
 * @param data Datos de la inspección
 * @returns ID de la inspección guardada
 */
export async function saveInspection(data: Partial<Inspeccion>): Promise<string> {
  // Asegurar que el directorio existe
  ensureDataDir();
  
  try {
    // Leer inspecciones existentes
    const inspections = await getAllInspections();
    
    // Generar ID si no existe
    const id = data.id || `insp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Crear inspección con fecha actual si no tiene
    const newInspection: Inspeccion = {
      ...data as any,
      id,
      submissionDate: data.submissionDate || new Date().toISOString(),
    };
    
    // Agregar a la lista y guardar
    inspections.push(newInspection);
    fs.writeFileSync(INSPECTIONS_FILE, JSON.stringify(inspections, null, 2));
    
    console.log(`Inspección guardada en el servidor con ID: ${id}`);
    return id;
  } catch (error) {
    console.error('Error al guardar inspección:', error);
    throw error;
  }
}

/**
 * Obtiene todas las inspecciones
 * @returns Lista de inspecciones
 */
export async function getAllInspections(): Promise<Inspeccion[]> {
  // Asegurar que el directorio existe
  ensureDataDir();
  
  try {
    const data = fs.readFileSync(INSPECTIONS_FILE, 'utf8');
    return JSON.parse(data) as Inspeccion[];
  } catch (error) {
    console.error('Error al leer inspecciones:', error);
    return [];
  }
}

/**
 * Obtiene una inspección por su ID
 * @param id ID de la inspección
 * @returns La inspección o null si no se encuentra
 */
export async function getInspectionById(id: string): Promise<Inspeccion | null> {
  try {
    const inspections = await getAllInspections();
    return inspections.find(insp => insp.id === id) || null;
  } catch (error) {
    console.error(`Error al buscar inspección con ID ${id}:`, error);
    return null;
  }
} 