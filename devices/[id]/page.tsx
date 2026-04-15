'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { QRCodeGenerator } from '@/components/qr-code-generator'
import { Spinner } from '@/components/ui/spinner'
import { useParams } from 'next/navigation'
import { getDevices } from '@/lib/storage'
import type { Device } from '@/lib/storage'

export default function DeviceDetailPage() {
  const params = useParams()
  const deviceId = params.id as string
  const [device, setDevice] = useState<Device | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const all = getDevices()
    const found = all.find((d) => d.device_id === deviceId) ?? null
    setDevice(found)
    setLoading(false)
  }, [deviceId])

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Spinner />
        </main>
      </>
    )
  }

  if (!device) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-2xl px-4 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-destructive mb-4">
                Device not found
              </h1>
              <p className="text-muted-foreground mb-6">
                This device may have been deleted or doesn&apos;t exist in your local inventory.
              </p>
              <Link href="/">
                <Button>Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/">
                <Button variant="outline" className="mb-4">
                  ← Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-4xl font-bold text-foreground">
                Device Details
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Device Information */}
            <div className="bg-card rounded-lg border border-border shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold mb-6">Information</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Device ID</p>
                  <p className="text-lg font-mono font-semibold">
                    {device.device_id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-lg font-semibold">{device.name}</p>
                </div>

                {device.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-base">{device.description}</p>
                  </div>
                )}

                {device.location && (
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-base">{device.location}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      device.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : device.status === 'maintenance'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                    }`}
                  >
                    {device.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-base">
                    {new Date(device.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-card rounded-lg border border-border shadow-sm p-6 flex flex-col items-center justify-center">
              <QRCodeGenerator
                device={device}
                logoUrl="/evara-logo.png"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
