'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'
import { decodeDevicePayload } from '@/lib/storage'
import { getDeviceImage } from '@/lib/device-images'
import type { Device } from '@/lib/storage'

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  active: {
    label: 'OPERATIONAL',
    color: 'bg-green-50 text-green-800 border border-green-200',
    dot: 'bg-green-500',
  },
  maintenance: {
    label: 'MAINTENANCE',
    color: 'bg-amber-50 text-amber-800 border border-amber-200',
    dot: 'bg-amber-500',
  },
  inactive: {
    label: 'OFFLINE',
    color: 'bg-gray-50 text-gray-600 border border-gray-200',
    dot: 'bg-gray-400',
  },
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-black/5 last:border-b-0">
      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-black/40">{label}</span>
      <span className={`text-sm font-bold text-black leading-snug ${mono ? 'font-mono' : ''}`}
        style={{ fontFamily: mono ? 'monospace' : 'Times New Roman, serif' }}>
        {value}
      </span>
    </div>
  )
}

function DeviceViewContent() {
  const searchParams = useSearchParams()
  const payload = searchParams.get('p')

  // Error state — no payload
  if (!payload) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-5">⚠</div>
          <h1 className="text-xl font-bold text-black uppercase tracking-tight mb-2" style={{ fontFamily: 'Times New Roman, serif' }}>Invalid QR</h1>
          <p className="text-xs text-black/40 uppercase tracking-widest font-bold">No device payload found in this code.</p>
        </div>
      </main>
    )
  }

  let device: Device | null = null
  try {
    device = decodeDevicePayload(payload)
  } catch {
    device = null
  }

  // Error state — bad decode
  if (!device) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-5">✕</div>
          <h1 className="text-xl font-bold text-black uppercase tracking-tight mb-2" style={{ fontFamily: 'Times New Roman, serif' }}>Cannot Decode</h1>
          <p className="text-xs text-black/40 uppercase tracking-widest font-bold">The data in this QR is corrupted or outdated.</p>
        </div>
      </main>
    )
  }

  const statusCfg = STATUS_CONFIG[device.status] || STATUS_CONFIG.inactive
  const registeredDate = new Date(device.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Top Bar */}
      <div className="w-full border-b border-black/5 px-6 py-4 flex items-center justify-between bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Image
            src="/evara-logo.png"
            alt="EvaraTech"
            width={32}
            height={32}
            className="h-8 w-auto object-contain"
            priority
          />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-black/50">EvaraTech</span>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest text-black/30">Device Scan</span>
      </div>

      {/* Hero */}
      <div className="px-6 pt-10 pb-6 border-b border-black/5 bg-white/30">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/3">
            <div className="aspect-square rounded-2xl overflow-hidden border border-black/10 shadow-xl bg-gray-50">
              <Image
                src={getDeviceImage(device.device_type)}
                alt={device.device_type}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-black/30 mb-2">REGISTERED DEVICE</p>
            <h1 className="text-4xl md:text-5xl font-bold text-black uppercase tracking-tight leading-none mb-4">
              {device.name || 'UNNAMED NODE'}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusCfg.color}`}>
                <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`}></span>
                {statusCfg.label}
              </div>
              <span className="text-[10px] font-bold text-black/20 uppercase tracking-widest font-mono">{device.device_id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="px-6 py-4 max-w-4xl mx-auto">
        <Field label="Device Type" value={device.device_type} />
        {device.location && <Field label="Location" value={device.location} />}
        {device.latitude && device.longitude && (
          <Field label="GPS Coordinates" value={`${device.latitude}° N, ${device.longitude}° E`} mono />
        )}
        {device.field_engineer && <Field label="Deployment Member" value={device.field_engineer} />}
        <Field label="Registration Date" value={registeredDate} />
      </div>

      {/* Footer */}
      <div className="px-6 py-8 mt-4 border-t border-black/5 text-center space-y-4 max-w-4xl mx-auto">
        <div className="space-y-2">
          <a
            href="https://evaratech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-bold text-black uppercase tracking-[0.3em] hover:text-black/70 transition-colors"
          >
            evaratech.com
          </a>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-black/60 uppercase tracking-[0.2em]">
            For any help or complaint
          </p>
          <a
            href="tel:9130190160"
            className="text-[14px] font-mono font-bold text-black uppercase tracking-wider hover:text-black/70 transition-colors"
          >
            9130190160
          </a>
        </div>
      </div>
    </main>
  )
}

export default function DeviceViewPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xs text-black/30 uppercase tracking-widest font-bold">Loading...</div>
      </main>
    }>
      <DeviceViewContent />
    </Suspense>
  )
}
