export interface InspeccionVehiculo {
  // Información general
  ownerName: string
  email: string
  phone: string
  licensePlate: string
  currentKm: string
  modelYear: string
  hasChassisNumber: string
  hasSecondKey: string
  crlvPhoto: File | null
  crlvPhotoUrl: string

  // Condición del vehículo
  vehicleConditions: string[]
  safetyItems: string[]
  safetyItemsPhoto: File | null
  safetyItemsPhotoUrl: string
  hasAirConditioner: string
  hasWindshieldDamage: string
  windshieldPhoto: File | null
  windshieldPhotoUrl: string
  hasLightsDamage: string
  lightsPhoto: File | null
  lightsPhotoUrl: string
  hasTiresDamage: string
  tiresPhoto: File | null
  tiresPhotoUrl: string
  hasOriginalSoundSystem: string

  // Video
  videoFile: File | null
  videoFileUrl: string
  videoBlob?: Blob
}
