import { type NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { saveInspection } from "@/lib/server-storage"

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const BUCKET = process.env.S3_BUCKET!;

export async function POST(request: NextRequest) {
  console.log("Recibida solicitud en /api/submit-form")
  
  try {
    const data = await request.json();

    // Paso 1: Solicitud de presigned URLs
    if (Array.isArray(data.requiredFiles)) {
      // Generar un ID único para la inspección
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 10);
      const inspectionId = `insp_${timestamp}_${randomId}`;

      // Generar presigned URLs para cada archivo requerido
      const uploadUrls: Record<string, string> = {};
      for (const key of data.requiredFiles) {
        const ext = key === 'videoFile' ? 'mp4' : 'jpg';
        const objectKey = `inspections/${inspectionId}/${key}.${ext}`;
        const command = new PutObjectCommand({
          Bucket: BUCKET,
          Key: objectKey,
          ContentType: key === 'videoFile' ? 'video/mp4' : 'image/jpeg',
        });
        const url = await getSignedUrl(s3, command, { expiresIn: 600 });
        uploadUrls[key] = url;
      }
      return NextResponse.json({ id: inspectionId, uploadUrls });
    }

    // Paso 2: Guardar la inspección (debe incluir las URLs de S3)
    // data debe tener: id, ownerName, licensePlate, ... y las URLs de S3
    if (!data.id) {
      return NextResponse.json({ success: false, error: 'Falta el ID de inspección' }, { status: 400 });
    }
    const dataWithMetadata = {
      ...data,
      submissionDate: new Date().toISOString(),
    };
    await saveInspection(dataWithMetadata);
    return NextResponse.json({ success: true, inspectionId: data.id });
  } catch (error: any) {
    console.error("Error en submit-form:", error);
    return NextResponse.json(
      { success: false, error: "Error al procesar la solicitud", message: error.message },
      { status: 500 }
    );
  }
}
