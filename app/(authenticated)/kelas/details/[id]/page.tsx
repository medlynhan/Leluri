"use client"
import { ArrowLeft, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ClassWithCreator } from "@/lib/types/class"
import RegistrationModal from "@/components/RegistrationModal"

export default function BaliDanceClass() {

  const temp_class: ClassWithCreator = {
    id: "1",
    title: "React for Beginners",
    creator_id: "12345",
    creator: {
      id: "anyaman_indonesia",
      username: "anyaman_indonesia",
      image_url: '/posts/1756376166448.png',
      role: 'pengrajin'
    },
    avg_rating: 4.8,
    // image_url: '/posts/1756376166448.png',
    image_url: '/posts/ss2.png',
    description: "Learn the fundamentals of React, including hooks, components, and state management.",
    location: "Online",
    created_at: "2023-08-01T14:30:00Z",
    category_id: "web-development",
  };

  const { id } = useParams()
  const router = useRouter()

  const [isRegistrationModalOpened, setIsRegistrationModalOpened] = useState<boolean>(false)

  const [classData, setClassData] = useState<ClassWithCreator|null>(null)
  useEffect(() => {
    setClassData(temp_class)
  }, [])

  useEffect(() => {
    if (isRegistrationModalOpened === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isRegistrationModalOpened]);

  if(!classData) return <div>Loading...</div>

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {isRegistrationModalOpened && 
      <RegistrationModal 
      classId={id ? (Array.isArray(id) ? id[0] : id) : ''}
      showRegistrationModal={isRegistrationModalOpened}
      setShowRegistrationModal={setIsRegistrationModalOpened}/>}

      <div className="sticky top-0 bg-white p-4">
        <ArrowLeft className="h-6 w-6 text-gray-700" onClick={() => router.back()}/>
      </div>
      <div className="flex flex-col px-24 gap-8 py-16">
        <div className="flex items-center justify-center w-full h-96 overflow-hidden rounded-lg">
          <Image src={classData.image_url} alt="NO IMAGE" width={2240} height={2240}
          className="object-contain bg-gray-200 h-full w-full"/>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{classData.title}</h1>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Class Description</h2>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= Math.floor(classData.avg_rating) ? "fill-orange-400 text-orange-400" : "text-gray-300"}`}
              />
            ))}
            <span className="ml-2 text-sm font-medium text-gray-900">{classData.avg_rating}</span>
          </div>
          <p 
            className="text-sm text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: classData.description }}
          />
        </div>

        <div className="space-y-3 pb-8">
          <h2 className="text-lg font-semibold text-gray-900">About Tutor</h2>
          <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={classData.creator.image_url} />
              <AvatarFallback className="bg-yellow-100 text-yellow-800">{classData.creator.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{classData.creator.username}</p>
              <p className="text-sm text-gray-500">{classData.creator.role}</p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-6 space-y-3">
          {/* <Button variant="outline" className="w-full rounded-full py-3 text-gray-700 border-gray-300 bg-transparent">
            Hubungi Sanggar Seni
          </Button> */}
          <Button
          className="w-full rounded-full py-3 bg-black text-white hover:bg-gray-800"
          onClick={() => {
            console.log("clicked")
            setIsRegistrationModalOpened(true)
          }}>
            Daftar Kelas
          </Button>
        </div>
      </div>
    </div>
  )
}
