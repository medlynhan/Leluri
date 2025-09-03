"use client"
import { ArrowLeft, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import RegistrationModal from "@/components/modal/ClassRegistrationModal"
import { useGetClassById } from "@/lib/client-queries/classes"
import LoadingComponent from "@/components/LoadingComponent"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

export default function ClassDetails() {

  const { id } = useParams()
  const router = useRouter()

  const [user, setUser] = useState<User|null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user) setUser(user);
        else router.push('/login');
    };
    fetchUser();
  }, [router]);

  if(!id) return <p>No class ID provided.</p>

  const { data: classData, isLoading: isGetClassByIdLoading, isError: isGetClassByIdError, error: getClassByIdError } = useGetClassById(Array.isArray(id) ? id[0] : id)

  const [isRegistrationModalOpened, setIsRegistrationModalOpened] = useState<boolean>(false)

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

  if(isGetClassByIdLoading) return <LoadingComponent message="Loading class information..."/>
  if(isGetClassByIdError || !classData) return <p>Could not load class data. Please try again later.</p>

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {isRegistrationModalOpened && user &&
      <RegistrationModal 
      formData={{
        class_id: id ? (Array.isArray(id) ? id[0] : id) : '',
        user_id: user.id,
        notes: ''
      }}
      showRegistrationModal={isRegistrationModalOpened}
      setShowRegistrationModal={setIsRegistrationModalOpened}
      user={user}
      className="fixed top-0 left-0 z-105 h-screen w-screen overflow-auto"/>}

      <div className="sticky top-0 pl-24 bg-white p-4">
        <ArrowLeft className="h-6 w-6 text-gray-700" onClick={() => router.back()}/>
      </div>
      <div className="flex flex-col px-24 gap-8 py-16">
        <div className="flex items-center justify-center w-full h-96 overflow-hidden rounded-lg">
          <Image src={classData.image_url} alt="NO IMAGE" width={2240} height={2240}
          className="object-contain bg-gray-200 h-full w-full"/>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{classData.name}</h1>
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
          onClick={() => setIsRegistrationModalOpened(true)}>
            Daftar Kelas
          </Button>
        </div>
      </div>
    </div>
  )
}
