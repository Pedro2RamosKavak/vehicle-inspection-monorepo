/**
 * Servicio para gestionar la subida de archivos a Firebase Storage y datos a Firestore
 */

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from './firebase';
import { fileToBase64 } from './storage-service';

/**
 * Sube un archivo a Firebase Storage
 * @param file Archivo a subir
 * @param path Ruta donde guardar el archivo
 * @returns URL pública del archivo
 */
export async function uploadFileToStorage(file: File, path: string): Promise<string> {
  try {
    // Crear una referencia al archivo
    const fileRef = ref(storage, path);
    
    // Subir el archivo
    await uploadBytes(fileRef, file);
    
    // Obtener la URL del archivo
    const url = await getDownloadURL(fileRef);
    
    console.log(`Archivo subido: ${file.name} - URL: ${url}`);
    return url;
  } catch (error) {
    console.error('Error al subir archivo a Firebase Storage:', error);
    throw error;
  }
}

/**
 * Guarda datos en Firestore
 * @param collectionName Nombre de la colección
 * @param data Datos a guardar
 * @returns ID del documento creado
 */
export async function saveToFirestore(collectionName: string, data: any): Promise<string> {
  try {
    // Añadir timestamp
    const dataWithTimestamp = {
      ...data,
      createdAt: serverTimestamp(),
    };
    
    // Guardar en Firestore
    const docRef = await addDoc(collection(db, collectionName), dataWithTimestamp);
    
    console.log(`Documento guardado con ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar en Firestore:', error);
    throw error;
  }
}

/**
 * Envía datos del formulario a Firebase
 * @param formData Datos del formulario
 * @returns Resultado de la operación
 */
export async function sendToFirebase(formData: any): Promise<any> {
  try {
    console.log("Procesando envío a Firebase...");
    
    // 1. Crear carpeta para el cliente usando email y placa
    const clientFolder = `inspecciones/${formData.email}-${formData.licensePlate}`;
    
    // 2. Subir archivos a Firebase Storage
    const fileUrls: Record<string, string> = {};
    const filePromises = [];
    
    // Subir CRLV
    if (formData.crlvPhoto) {
      const path = `${clientFolder}/crlv_${Date.now()}.${getFileExtension(formData.crlvPhoto.name)}`;
      const promise = uploadFileToStorage(formData.crlvPhoto, path)
        .then(url => fileUrls.crlvPhotoUrl = url);
      filePromises.push(promise);
    }
    
    // Subir items de seguridad
    if (formData.safetyItemsPhoto) {
      const path = `${clientFolder}/safety_${Date.now()}.${getFileExtension(formData.safetyItemsPhoto.name)}`;
      const promise = uploadFileToStorage(formData.safetyItemsPhoto, path)
        .then(url => fileUrls.safetyItemsPhotoUrl = url);
      filePromises.push(promise);
    }
    
    // Subir parabrisas si existe
    if (formData.windshieldPhoto) {
      const path = `${clientFolder}/windshield_${Date.now()}.${getFileExtension(formData.windshieldPhoto.name)}`;
      const promise = uploadFileToStorage(formData.windshieldPhoto, path)
        .then(url => fileUrls.windshieldPhotoUrl = url);
      filePromises.push(promise);
    }
    
    // Subir luces si existe
    if (formData.lightsPhoto) {
      const path = `${clientFolder}/lights_${Date.now()}.${getFileExtension(formData.lightsPhoto.name)}`;
      const promise = uploadFileToStorage(formData.lightsPhoto, path)
        .then(url => fileUrls.lightsPhotoUrl = url);
      filePromises.push(promise);
    }
    
    // Subir neumáticos si existe
    if (formData.tiresPhoto) {
      const path = `${clientFolder}/tires_${Date.now()}.${getFileExtension(formData.tiresPhoto.name)}`;
      const promise = uploadFileToStorage(formData.tiresPhoto, path)
        .then(url => fileUrls.tiresPhotoUrl = url);
      filePromises.push(promise);
    }
    
    // Subir video
    if (formData.videoFile) {
      const path = `${clientFolder}/video_${Date.now()}.${getFileExtension(formData.videoFile.name)}`;
      const promise = uploadFileToStorage(formData.videoFile, path)
        .then(url => fileUrls.videoFileUrl = url);
      filePromises.push(promise);
    }
    
    // Esperar a que se completen todas las subidas
    await Promise.all(filePromises);
    console.log("Archivos subidos:", fileUrls);
    
    // 3. Guardar datos en Firestore
    const dataToSave = {
      // Información personal
      ownerName: formData.ownerName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      
      // Información del vehículo
      licensePlate: formData.licensePlate || "",
      currentKm: formData.currentKm || "",
      modelYear: formData.modelYear || "",
      hasChassisNumber: formData.hasChassisNumber || "",
      hasSecondKey: formData.hasSecondKey || "",
      
      // Condición del vehículo
      vehicleConditions: Array.isArray(formData.vehicleConditions) 
        ? formData.vehicleConditions.join(", ") 
        : formData.vehicleConditions || "",
      safetyItems: Array.isArray(formData.safetyItems) 
        ? formData.safetyItems.join(", ") 
        : formData.safetyItems || "",
      hasAirConditioner: formData.hasAirConditioner || "",
      hasWindshieldDamage: formData.hasWindshieldDamage || "",
      hasLightsDamage: formData.hasLightsDamage || "",
      hasTiresDamage: formData.hasTiresDamage || "",
      hasOriginalSoundSystem: formData.hasOriginalSoundSystem || "",
      
      // URLs de archivos
      ...fileUrls,
      
      // Metadatos
      clientFolder,
      submissionDate: new Date().toISOString(),
    };
    
    const docId = await saveToFirestore("inspecciones", dataToSave);
    
    return {
      success: true,
      message: "Datos enviados a Firebase correctamente",
      docId,
      fileUrls
    };
  } catch (error) {
    console.error("Error en firebase-service:", error);
    throw error;
  }
}

/**
 * Obtiene la extensión de un archivo
 * @param filename Nombre del archivo
 * @returns Extensión del archivo
 */
function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || 'jpg';
} 