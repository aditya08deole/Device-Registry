export const DEVICE_IMAGES: Record<string, string> = {
  'EvaraDeep': '/EvaraDeep.jpg',
  'EvaraFlow': '/EvaraFlow.png',
  'Evaratank': '/EvaraTank.jpg',
  'EvaraRain': '/RainRain.png',
  'EvaraTDS': '/placeholder.jpg',
  'EvaraValve': '/placeholder.jpg',
  'EvaraAmp': '/placeholder.jpg',
  'Other': '/placeholder.jpg',
}

export function getDeviceImage(deviceType: string): string {
  return DEVICE_IMAGES[deviceType] || DEVICE_IMAGES['Other']
}
