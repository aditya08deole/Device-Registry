'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Empty, EmptyHeader, EmptyDescription } from '@/components/ui/empty'
import { getDevices, deleteDevice } from '@/lib/storage'
import type { Device } from '@/lib/storage'

export function DeviceList({ refreshKey }: { refreshKey?: number }) {
  const [devices, setDevices] = useState<Device[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setDevices(getDevices())
  }, [refreshKey])

  const filteredDevices = useMemo(() => {
    const lower = searchTerm.toLowerCase()
    return devices.filter(
      (device: Device) =>
        device.device_id.toLowerCase().includes(lower) ||
        device.name.toLowerCase().includes(lower) ||
        (device.location || '').toLowerCase().includes(lower)
    )
  }, [devices, searchTerm])

  const handleDelete = (deviceId: string) => {
    if (!confirm('Are you sure you want to delete this device?')) return
    deleteDevice(deviceId)
    setDevices(getDevices())
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5">
            <span className="material-symbols-outlined text-xl">database</span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 tracking-tight">Fleet Registry Ledger</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Secure Local Environment</p>
          </div>
        </div>
        <div className="relative max-w-xs w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <Input
            placeholder="Search Ledger..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10 glass-input border-none rounded-xl text-sm"
          />
        </div>
      </div>

      {devices.length === 0 ? (
        <Empty className="glass-panel border-none rounded-3xl p-12 shadow-sm">
          <EmptyHeader>
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 mx-auto">
              <span className="material-symbols-outlined text-3xl text-slate-400">inventory_2</span>
            </div>
            <EmptyDescription className="text-sm font-medium">The hardware ledger is currently empty. Initialize a new node to begin tracking.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : filteredDevices.length === 0 ? (
        <Empty className="glass-panel border-none rounded-3xl p-12">
          <EmptyHeader>
            <EmptyDescription className="text-sm font-medium">No results found in the registry for &quot;{searchTerm}&quot;.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="glass-panel border-none rounded-3xl overflow-hidden shadow-polymorph">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4">Node ID</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4">Designation</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4">Sector</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4">Operational Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4 text-right pr-8">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device: Device) => (
                <TableRow key={device.device_id} className="border-slate-50 hover:bg-white/40 transition-colors">
                  <TableCell className="font-mono font-bold text-xs text-primary py-4">
                    {device.device_id}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-700">{device.name}</TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {device.location || '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        device.status === 'active' ? 'bg-accent' : device.status === 'maintenance' ? 'bg-yellow-400' : 'bg-slate-300'
                      }`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                        {device.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4 pr-8 space-x-2">
                    <Link href={`/devices/${device.device_id}`}>
                      <Button variant="ghost" size="sm" className="h-8 rounded-lg hover:bg-white hover:shadow-sm text-xs font-bold gap-2">
                        <span className="material-symbols-outlined text-sm">qr_code_2</span>
                        VIEW
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(device.device_id)}
                      className="h-8 rounded-lg hover:bg-destructive/10 hover:text-destructive text-slate-400 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
