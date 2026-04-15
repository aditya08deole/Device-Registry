'use client'

import { QRCodeCanvas } from 'qrcode.react'
import { useRef, useMemo, useState, useEffect } from 'react'
import { encodeDevicePayload } from '@/lib/storage'
import type { Device } from '@/lib/storage'

interface QRCodeGeneratorProps {
  device: Device
  isConfirmed: boolean
}

export function QRCodeGenerator({ device, isConfirmed }: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null)
  const [isLocalDev, setIsLocalDev] = useState(false)

  useEffect(() => {
    setIsLocalDev(window.location.hostname === 'localhost')
  }, [])

  /**
   * QR encodes a full public URL.
   * - In production (Vercel): uses NEXT_PUBLIC_APP_URL (e.g. https://evara.vercel.app)
   * - In local dev: uses window.location.origin (localhost — only works on same machine)
   *
   * When a phone scans the QR after Vercel deployment, it opens:
   *   https://your-app.vercel.app/device/view?p={encoded_payload}
   * That page decodes the payload and shows the device info — no database needed.
   */
  const qrValue = useMemo(() => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
    const payload = encodeDevicePayload(device)
    return `${appUrl}/device/view?p=${payload}`
  }, [device])

  const downloadQRAsPNG = () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png', 1.0)
      const link = document.createElement('a')
      const deviceType = device.device_type || 'Unknown'
      const deviceId = device.device_id || 'NoID'
      const nodeId = device.name || 'NoNode'
      const fileName = `${deviceType}_${deviceId}_${nodeId}.png`
      link.href = dataUrl
      link.download = fileName
      link.click()
    }
  }

  return (
    <div className="glass-panel-gray rounded-[1rem] md:rounded-[1.5rem] p-4 md:p-6 shadow-sm h-full flex flex-col items-center justify-between relative overflow-hidden border border-black/10">

      {/* Header */}
      <div className="w-full z-10">
        <h3 className="font-bold text-lg md:text-xl text-black uppercase tracking-tight leading-none" style={{ fontFamily: 'Times New Roman, serif' }}>DEVICE QR</h3>
        {isLocalDev && (
          <p className="text-[7px] md:text-[8px] text-black/30 uppercase tracking-widest mt-1 font-bold">
            ⚠ Deploy to Vercel for scannable QR
          </p>
        )}
      </div>

      {/* QR Display */}
      <div className="relative flex-1 flex items-center justify-center w-full my-2 md:my-3">
        <div
          ref={qrRef}
          className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-black/5 shadow-2xl transition-all duration-300 flex flex-col items-center"
        >
          <QRCodeCanvas
            value={qrValue}
            size={200}
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#000000"
            imageSettings={{
              src: "/evara-logo.png",
              x: undefined,
              y: undefined,
              height: 30,
              width: 30,
              excavate: true,
            }}
          />
          {device.device_id && (
            <div className="mt-2 md:mt-3 text-center">
              <p className="text-[11px] md:text-[14px] font-bold text-black tracking-wider" style={{ fontFamily: 'Times New Roman, serif' }}>
                {device.device_id}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="w-full pt-3 md:pt-4">
        {isConfirmed ? (
          <button
            onClick={downloadQRAsPNG}
            className="w-full flex items-center justify-center gap-2 md:gap-3 bg-black text-white py-3 rounded-xl text-[11px] md:text-[13px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] transition-all hover:bg-slate-900 shadow-xl active:scale-95"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px md:20px' }}>download</span>
            EXPORT(.PNG)
          </button>
        ) : (
          <div className="w-full flex items-center justify-center py-3 text-[9px] md:text-[10px] font-bold text-black/30 uppercase tracking-[0.4em] border-2 border-dashed border-black/10 rounded-xl">
            AWAITING VERIFICATION
          </div>
        )}
      </div>
    </div>
  )
}
