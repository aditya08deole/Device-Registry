'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { saveDevice } from '@/lib/storage'

interface AddDeviceDialogProps {
  onDeviceAdded: () => void
}

export function AddDeviceDialog({ onDeviceAdded }: AddDeviceDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    saveDevice({
      name: name.trim(),
      description: description.trim(),
      location: location.trim(),
      status: 'active',
    })

    setName('')
    setDescription('')
    setLocation('')
    setOpen(false)
    onDeviceAdded()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Device</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription>
            Create a new tracked device. All data is stored locally on this computer.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Device Name *</FieldLabel>
            <Input
              id="name"
              placeholder="e.g., Laptop #001"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Input
              id="description"
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              placeholder="e.g., Building A, Floor 3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Field>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Device</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
