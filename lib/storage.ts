export interface Device {
  device_id: string
  name: string
  description: string
  location: string
  status: 'active' | 'maintenance' | 'inactive'
  created_at: string
  device_type: string
  field_engineer?: string
  latitude?: string
  longitude?: string
}

const STORAGE_KEY = 'evara_devices'

function generateDeviceId(): string {
  const randomNum = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0')
  return `EVT-${randomNum}`
}

export function getDevices(): Device[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveDevice(device: Omit<Device, 'device_id' | 'created_at'>): Device {
  const newDevice: Device = {
    ...device,
    device_id: generateDeviceId(),
    created_at: new Date().toISOString(),
  }
  const devices = getDevices()
  devices.unshift(newDevice)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(devices))
  return newDevice
}

export function deleteDevice(deviceId: string): void {
  const devices = getDevices().filter((d) => d.device_id !== deviceId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(devices))
}

export function updateDevice(deviceId: string, updates: Partial<Device>): Device | null {
  const devices = getDevices()
  const index = devices.findIndex((d) => d.device_id === deviceId)
  if (index === -1) return null
  devices[index] = { ...devices[index], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(devices))
  return devices[index]
}

/** Encode a device into a base64 URL-safe payload */
export function encodeDevicePayload(device: Device): string {
  const payload = {
    id: device.device_id,
    n: device.name,
    l: device.location,
    d: device.description,
    s: device.status,
    t: device.created_at,
    dt: device.device_type,
    fe: device.field_engineer,
    lat: device.latitude,
    lng: device.longitude,
  }
  return btoa(
    encodeURIComponent(JSON.stringify(payload)).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  )
}

/** Decode a base64 URL-safe payload into device data */
export function decodeDevicePayload(encoded: string): Device | null {
  try {
    const json = decodeURIComponent(
      atob(encoded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
    const payload = JSON.parse(json)
    return {
      device_id: payload.id,
      name: payload.n,
      location: payload.l,
      description: payload.d,
      status: payload.s,
      created_at: payload.t,
      device_type: payload.dt || 'Unknown',
      field_engineer: payload.fe,
      latitude: payload.lat,
      longitude: payload.lng,
    }
  } catch {
    return null
  }
}
