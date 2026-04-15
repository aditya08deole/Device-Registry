'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { RegistrationForm } from '@/components/registration-form'
import { QRCodeGenerator } from '@/components/qr-code-generator'
import type { Device } from '@/lib/storage'

export default function Dashboard() {
  const [device, setDevice] = useState<Device>({
    device_id: '',
    name: '',
    device_type: 'EvaraDeep',
    location: '',
    latitude: '',
    longitude: '',
    field_engineer: '',
    description: '',
    status: 'active',
    created_at: new Date().toISOString(),
  })

  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleDeviceUpdate = useCallback((updates: Partial<Device>) => {
    setDevice(prev => ({ ...prev, ...updates }))
    // Reset confirmation if user starts typing again
    setIsConfirmed(false)
  }, [])

  const handleConfirm = useCallback(() => {
    setIsConfirmed(true)
  }, [])

  return (
    <main className="h-screen w-full overflow-hidden flex flex-col items-center bg-gradient-to-br from-gray-50 to-white p-3 md:p-4 select-none">
      {/* Header Branding */}
      <div className="w-full max-w-7xl flex flex-col items-center mb-4 gap-1.5 shrink-0">
        <Image
          src="/evara-logo.png"
          alt="Evara"
          width={40}
          height={40}
          className="h-10 w-auto object-contain"
          priority
        />
        <h1 className="text-2xl font-bold text-black tracking-tight uppercase">EvaraTech</h1>
        <div className="flex items-center gap-3">
            <div className="h-[1px] w-12 bg-black/10"></div>
            <p className="text-[10px] font-bold text-black/60 uppercase tracking-[0.4em]">Device Registry</p>
            <div className="h-[1px] w-12 bg-black/10"></div>
        </div>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-12 gap-5 items-stretch flex-1 min-h-0">
        {/* Left Column: Form */}
        <div className="col-span-12 lg:col-span-7 flex flex-col min-h-0">
          <RegistrationForm
            onUpdate={handleDeviceUpdate}
            currentDevice={device}
            onConfirm={handleConfirm}
            isConfirmed={isConfirmed}
          />
        </div>

        {/* Right Column: QR Profile */}
        <div className="col-span-12 lg:col-span-5 flex flex-col min-h-0">
          <QRCodeGenerator device={device} isConfirmed={isConfirmed} />
        </div>
      </div>
    </main>
  )
}
