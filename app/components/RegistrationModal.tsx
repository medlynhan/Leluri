"use client"
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import { DialogHeader } from "./ui/dialog"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useState } from "react"

interface RegistrationModalInterface {
  showRegistrationModal : boolean,
  setShowRegistrationModal: React.Dispatch<React.SetStateAction<boolean>>
  classId: string
}

interface ClassJoinInput {
  id: string
  name: string,
  kelas: string,
}

const RegistrationModal = ({
  showRegistrationModal,
  setShowRegistrationModal,
  classId
} : RegistrationModalInterface) => {

  const [registrationData, setRegistrationData] = useState<ClassJoinInput>({
    name: '',
    kelas: '',
    id: classId
  })

  const handleRegistrationSubmit = () => {
    console.log("Registration submitted:", registrationData)
    setShowRegistrationModal(false)
  }

  return (
    <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Daftar Kelas</DialogTitle>
          <p className="text-sm text-gray-600 text-center">Lengkapi data Anda !</p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Nama</label>
            <Input
              value={registrationData.name}
              onChange={(e) => setRegistrationData((prev) => ({ ...prev, nama: e.target.value }))}
              className="rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Kelas</label>
            <Input
              value={registrationData.kelas}
              onChange={(e) => setRegistrationData((prev) => ({ ...prev, kelas: e.target.value }))}
              className="rounded-lg"
            />
          </div>

          <div className="text-xs text-gray-600 mt-4">
            <p className="mb-2">
              <strong>Alamat Belajar</strong>
            </p>
            <p>Jalan Campuhan Raya Tengah 2, Denpasar, Bali</p>
            <p className="mt-2">Kami akan menghubungi Anda melalui WhatsApp untuk konfirmasi lebih lanjut.</p>
          </div>

          <Button
            onClick={handleRegistrationSubmit}
            className="w-full bg-black hover:bg-gray-800 text-white rounded-full mt-6"
          >
            Daftar
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-xs">👤</span>
          </div>
          <span className="text-xs text-gray-600">senggamadhika_</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}