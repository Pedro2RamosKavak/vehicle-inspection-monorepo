'use client';

import Link from 'next/link'
import InspeccionVehiculo from '../components/inspeccion-vehiculo'
import { useState } from 'react';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Inspección de Vehículos
        </p>
      </div>

      {!showForm ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <h1 className="text-4xl font-bold mb-8 text-center">Sistema de Inspección Virtual de Vehículos</h1>
          
          <div className="grid gap-6 w-full max-w-2xl">
            <button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-center text-lg shadow-md"
            >
              Realizar nueva inspección
            </button>
            
            <Link 
              href="/inspecciones" 
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg text-center text-lg shadow-md"
            >
              Ver inspecciones realizadas
            </Link>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-3">¿Cómo ver las inspecciones?</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Haz clic en "Ver inspecciones realizadas"</li>
                <li>Selecciona cualquier inspección de la lista</li>
                <li>En la página de detalles podrás ver:
                  <ul className="list-disc pl-5 mt-2">
                    <li>Información del vehículo</li>
                    <li>Fotos de todas las áreas inspeccionadas</li>
                    <li>Video de la inspección completa</li>
                  </ul>
                </li>
              </ol>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6 shadow-md mt-4">
              <h2 className="text-xl font-semibold mb-3">Demostración</h2>
              <p className="mb-3">
                Si no ves ninguna inspección, es porque aún no has realizado ninguna o porque se almacenan 
                localmente en este navegador.
              </p>
              <button 
                id="demoButton"
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                onClick={() => {
                  // Esta función se ejecutará en el cliente
                  try {
                    // Crear una inspección de demostración
                    const demo = {
                      id: `demo_${Date.now()}`,
                      titular: "Usuario Demostración",
                      email: "demo@example.com",
                      celular: "(11) 98765-4321",
                      placa: "ABC1234",
                      km_atual: "45.678",
                      ano_modelo: "2020",
                      vidros_chassi: "Sim",
                      segunda_chave: "Sim",
                      caracteristicas: "Ninguna de las opciones anteriores",
                      itens_seguranca: "Chave de roda, Estepe, Triângulo",
                      ar_condicionado: "Sim",
                      parabrisa_avariado: "Não",
                      farois_lanternas_retrovisores_danificados: "Não",
                      pneus_danificados: "Não",
                      som_original: "Sim",
                      // Imágenes de Pexels con URLs absolutas
                      crlv_url: "https://i.imgur.com/UcgCPCY.jpeg",
                      foto_itens_seguranca_url: "https://i.imgur.com/AyK4MqU.jpeg",
                      foto_parabrisa_url: "https://i.imgur.com/19tZfGk.jpeg",
                      foto_farois_lanternas_url: "https://i.imgur.com/IaXAdYt.jpeg",
                      foto_pneus_url: "https://i.imgur.com/u5nT6aU.jpeg",
                      upload_video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                      submissionDate: new Date().toISOString(),
                      request_id: `demo_req_${Date.now()}`,
                    };
                    
                    // Guardar en localStorage
                    const existingInspections = localStorage.getItem('inspecciones');
                    let inspecciones = existingInspections ? JSON.parse(existingInspections) : [];
                    inspecciones.push(demo);
                    localStorage.setItem('inspecciones', JSON.stringify(inspecciones));
                    
                    // Dar feedback al usuario
                    alert("¡Inspección de demostración creada! Ahora puedes verla en la lista de inspecciones.");
                    
                    // Opcional: redirigir
                    window.location.href = "/inspecciones";
                  } catch (error) {
                    console.error("Error al crear demostración:", error);
                    alert("Error al crear la demostración. Consulta la consola para más detalles.");
                  }
                }}
              >
                Crear inspección de demostración
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto mt-4">
          <button 
            onClick={() => setShowForm(false)}
            className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver al inicio
          </button>
      <InspeccionVehiculo />
        </div>
      )}
    </main>
  );
}
