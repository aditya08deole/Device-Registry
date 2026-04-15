'use client'

import { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { useParams } from 'next/navigation'

interface Device {
  device_id: string
  name: string
  description: string
  location: string
  status: string
  created_at: string
}

// Demo data for public device view
const DEMO_DEVICES: Record<string, Device> = {
  'EVT-00001': {
    device_id: 'EVT-00001',
    name: 'Gateway Device A',
    description: 'Main IoT gateway for building A',
    location: 'Building A - Main Floor',
    status: 'active',
    created_at: new Date().toISOString(),
  },
  'EVT-00002': {
    device_id: 'EVT-00002',
    name: 'Sensor Unit B',
    description: 'Temperature and humidity sensor',
    location: 'Building B - Floor 3',
    status: 'active',
    created_at: new Date().toISOString(),
  },
  'EVT-00003': {
    device_id: 'EVT-00003',
    name: 'Monitoring Station C',
    description: 'Central monitoring device',
    location: 'Control Room',
    status: 'maintenance',
    created_at: new Date().toISOString(),
  },
}

export default function PublicDevicePage() {
  const params = useParams()
  const deviceId = params.id as string
  const [device, setDevice] = useState<Device | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await fetch(`/api/devices/${deviceId}`)
        if (!response.ok) {
          throw new Error('Device not found')
        }
        const data = await response.json()
        setDevice(data)
      } catch (err) {
        // Fall back to demo data
        const demoDevice = DEMO_DEVICES[deviceId]
        if (demoDevice) {
          setDevice(demoDevice)
        } else {
          setError(err instanceof Error ? err.message : 'Device not found')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDevice()
  }, [deviceId])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Spinner />
      </main>
    )
  }

  if (error || !device) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              {error || 'Device not found'}
            </h1>
            <p className="text-muted-foreground">
              Please check the QR code and try again.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Device Information
          </h1>
          <p className="text-muted-foreground">
            Details about this tracked device
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-lg p-8 space-y-8">
          {/* Device Header */}
          <div className="text-center border-b border-border pb-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {device.name}
            </h2>
            <p className="text-lg font-mono text-muted-foreground">
              {device.device_id}
            </p>
          </div>

          {/* Device Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </p>
                <span
                  className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
                    device.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                  }`}
                >
                  {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                </span>
              </div>

              {device.location && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Location
                  </p>
                  <p className="text-lg mt-2 text-foreground">{device.location}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {device.description && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Description
                  </p>
                  <p className="text-lg mt-2 text-foreground">{device.description}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Last Updated
                </p>
                <p className="text-lg mt-2 text-foreground">
                  {new Date(device.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="border-t border-border pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              This device information is publicly accessible via QR code.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
