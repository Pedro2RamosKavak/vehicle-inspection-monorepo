import React, { useCallback, useState } from 'react';
import VideoUpload from './VideoUpload';

interface FormData {
  videoFileUrl?: string;
  // ... otros campos del formulario
}

const InspectionForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});

  const handleVideoUploaded = useCallback((url: string) => {
    console.log('Video subido exitosamente:', url);
    setFormData(prev => ({
      ...prev,
      videoFileUrl: url
    }));
  }, []);

  const handleVideoError = useCallback((error: Error) => {
    console.error('Error al subir video:', error);
    alert('Error al subir el video: ' + error.message);
  }, []);

  return (
    <div>
      {/* Sección de Video */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Video de la inspección</h3>
        <VideoUpload 
          onVideoUploaded={handleVideoUploaded}
          onError={handleVideoError}
        />
        {formData.videoFileUrl && (
          <div className="mt-2">
            <p className="text-sm text-green-600">Video subido correctamente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectionForm; 