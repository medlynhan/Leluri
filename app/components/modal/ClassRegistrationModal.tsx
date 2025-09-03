"use client"
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import { DialogClose, DialogHeader } from "../ui/dialog"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { ClassMenteeFormInput } from "@/lib/types/classmentees"
import { useCreateClassMentee } from "@/lib/client-queries/classmentees"

interface RegistrationModalInterface {
  showRegistrationModal : boolean,
  setShowRegistrationModal: React.Dispatch<React.SetStateAction<boolean>>
  formData: ClassMenteeFormInput
  className?: string,
}

const RegistrationModal = ({
  showRegistrationModal,
  setShowRegistrationModal,
  formData,
  className = ''
} : RegistrationModalInterface) => {

  const [registrationData, setRegistrationData] = useState<ClassMenteeFormInput>({
    ...formData,
    notes: ''
  })

  const { mutate: createClassMentee, isPending: isCreateClassMenteePending, isError, error } = useCreateClassMentee()

  const handleRegistrationSubmit = () => {
    createClassMentee({
      ...registrationData
    }, {
      onSuccess: () => setShowRegistrationModal(false)
    })
  }

  useEffect(() => {
    console.log(registrationData)
  }, [registrationData])

  return (
    <div className={`${className}`}>
      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent 
        className="fixed z-102 flex min-h-screen w-screen bg-black/50 mx-auto justify-center items-center">
          <div
          className="relative bg-white w-1/2 z-103 max-w-180 rounded-lg p-12">
            <DialogClose asChild>
              <button className="absolute top-4 right-4 text-gray-500 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
            <DialogHeader>
              <DialogTitle className="text-center font-semibold text-lg">DAFTAR KELAS</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Motivation & Notes for Tutor/Mentor</label>
                <textarea
                  value={registrationData.notes}
                  onChange={(e) => setRegistrationData((prev) => ({ ...prev, notes: e.target.value }))}
                  className="rounded-lg w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                />
              </div>
              <Button
              onClick={handleRegistrationSubmit}
              className="w-full bg-black hover:bg-gray-800 text-white rounded-full mt-6">
                Daftar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RegistrationModal