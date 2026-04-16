'use client'

import type { Device } from '@/lib/storage'

interface RegistrationFormProps {
  onUpdate: (updates: Partial<Device>) => void
  currentDevice: Device
  onConfirm: () => void
  isConfirmed: boolean
}

const DEVICE_TYPES = [
  'EvaraDeep',
  'EvaraFlow',
  'Evaratank',
  'EvaraTDS',
  'EvaraValve',
  'EvaraRain',
  'EvaraAmp',
  'Other'
]

export function RegistrationForm({ onUpdate, currentDevice, onConfirm, isConfirmed }: RegistrationFormProps) {
  const handleChange = (field: keyof Device, value: string) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="glass-panel-gray rounded-[1rem] md:rounded-[1.5rem] p-4 md:p-6 shadow-sm flex flex-col border border-black/10">
      <div className="space-y-3">
        <div className="border-b border-black/5 pb-2 md:pb-3">
          <h3 className="text-lg md:text-xl font-bold text-black uppercase tracking-tight" style={{ fontFamily: 'Times New Roman, serif' }}>SPECIFICATIONS</h3>
          <p className="text-[8px] md:text-[9px] text-black font-bold uppercase tracking-[0.3em] mt-1 opacity-60">REGISTRY UNIT</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="space-y-1.5">
            <label className="text-[8px] md:text-[9px] font-bold text-black uppercase tracking-widest ml-1">DEVICE ID *</label>
            <input
              className="w-full bg-white border-2 border-black/10 rounded-xl py-2 px-3 text-sm font-mono font-bold focus:ring-2 focus:ring-black/20 placeholder:text-black/15 outline-none shadow-sm text-black transition-all"
              placeholder="EVT-XXXXX"
              value={currentDevice.device_id}
              onChange={(e) => handleChange('device_id', e.target.value)}
              type="text"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[8px] md:text-[9px] font-bold text-black uppercase tracking-widest ml-1">DEVICE TYPE *</label>
            <select
              value={currentDevice.device_type}
              onChange={(e) => handleChange('device_type', e.target.value)}
              className="w-full bg-white border-2 border-black/10 rounded-xl py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-black/20 text-black outline-none shadow-sm transition-all"
              required
            >
              {DEVICE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[8px] md:text-[9px] font-bold text-black uppercase tracking-widest ml-1">NODE ID *</label>
          <input
            className="w-full bg-white border-2 border-black/10 rounded-xl py-2 px-3 text-sm font-mono font-bold focus:ring-2 focus:ring-black/20 placeholder:text-black/15 outline-none shadow-sm text-black transition-all"
            placeholder="000-000"
            value={currentDevice.name}
            onChange={(e) => handleChange('name', e.target.value)}
            type="text"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="space-y-1.5">
            <label className="text-[8px] md:text-[9px] font-bold text-black uppercase tracking-widest ml-1">LOCATION *</label>
            <input
              className="w-full bg-white border-2 border-black/10 rounded-xl py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-black/20 placeholder:text-black/15 outline-none shadow-sm text-black transition-all"
              placeholder="SITE SECTOR"
              value={currentDevice.location}
              onChange={(e) => handleChange('location', e.target.value)}
              type="text"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[8px] md:text-[9px] font-bold text-black uppercase tracking-widest ml-1">STATE *</label>
            <select
              value={currentDevice.status}
              onChange={(e) => handleChange('status', e.target.value as any)}
              className="w-full bg-white border-2 border-black/10 rounded-xl py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-black/20 text-black outline-none shadow-sm transition-all"
              required
            >
              <option value="active">OPERATIONAL</option>
              <option value="maintenance">MAINTENANCE</option>
              <option value="inactive">OFFLINE</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="space-y-1.5">
            <label className="text-[8px] md:text-[9px] font-bold text-black uppercase tracking-widest ml-1">LATITUDE *</label>
            <input
              className="w-full bg-white border-2 border-black/10 rounded-xl py-2 px-3 text-xs font-mono font-bold focus:ring-2 focus:ring-black/20 placeholder:text-black/15 outline-none shadow-sm text-black transition-all"
              placeholder="00.0000"
              value={currentDevice.latitude || ''}
              onChange={(e) => handleChange('latitude', e.target.value)}
              type="text"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[8px] md:text-[9px] font-bold text-black uppercase tracking-widest ml-1">LONGITUDE *</label>
            <input
              className="w-full bg-white border-2 border-black/10 rounded-xl py-2 px-3 text-xs font-mono font-bold focus:ring-2 focus:ring-black/20 placeholder:text-black/15 outline-none shadow-sm text-black transition-all"
              placeholder="00.0000"
              value={currentDevice.longitude || ''}
              onChange={(e) => handleChange('longitude', e.target.value)}
              type="text"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[8px] md:text-[9px] font-bold text-black uppercase tracking-widest ml-1">DEPLOYMENT MEMBER (OPTIONAL)</label>
          <input
            className="w-full bg-white border-2 border-black/10 rounded-xl py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-black/20 placeholder:text-black/15 outline-none shadow-sm text-black transition-all"
            value={currentDevice.field_engineer || ''}
            onChange={(e) => handleChange('field_engineer', e.target.value)}
            placeholder="MEMBER NAME"
            type="text"
          />
        </div>
      </div>

      <div className="pt-3 md:pt-4 mt-3 md:mt-4 border-t border-black/5 flex-shrink-0">
        <button
          className={`w-full py-3 rounded-xl font-bold text-[12px] md:text-[13px] uppercase tracking-[0.4em] md:tracking-[0.5em] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] ${isConfirmed ? 'bg-black text-white' : 'bg-black/5 hover:bg-black/10 text-black border-2 border-black/10'}`}
          type="button"
          onClick={onConfirm}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px md:20px' }}>{isConfirmed ? 'verified' : 'how_to_reg'}</span>
          {isConfirmed ? 'VERIFIED' : 'VERIFY'}
        </button>
      </div>
    </div>
  )
}
