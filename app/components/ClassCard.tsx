import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { ClassCardInterface } from "@/lib/types/classes"
import Image from "next/image"
import StarRating from "./StarRating"

interface ClassCardInternalInterface {
  kelas : ClassCardInterface
  onClick?: () => void
}

const ClassCard = ({
  kelas,
  onClick
} : ClassCardInternalInterface) => {

  const router = useRouter()

  return (
    <div
      key={kelas.id}
      className="bg-[var(--white)] w-full rounded-2xl overflow-hidden border border-[var(--medium-grey)] cursor-pointer transition-transform duration-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-square">
        <Image
          src={kelas.image_url || "/logo/empty.png"}
          alt={kelas.name}
          fill
          className="rounded-t-2xl object-cover"
        />
      </div>

      {/* Content */}
      <div className="w-full grid p-4">
        <h3 className="w-full text-lg font-semibold truncate">{kelas.name}</h3>

        <div className="my-2">

          <div className="mt-1">
            <StarRating rating={kelas.rating || 0} />
          </div>
          <Button
          onClick={() => router.push(`/kelas/details/${kelas.id}`)}
          className="w-full h-[40%] bg-white border-[var(--black)] border text-black hover:bg-[var(--light-grey)] rounded-full mt-5">
            Lihat Detail
          </Button>
        </div>

        <hr />
        {/* Creator Info */}
        <div className="flex items-center p-2 mt-2 border-[var(--medium-grey)] bg-gray-50 hover:bg-gray-100 rounded-md"
        onClick={(e) => {
          e.stopPropagation()
          router.push(`/profile/${kelas.creator.id}`)
        }}>
          <Avatar className="w-8 h-8 rounded-full border overflow-hidden">
            <AvatarImage src={kelas.creator.image_url || "/placeholder.svg"} />
            <AvatarFallback>{kelas.creator.username[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-xs font-semibold text-[var(--black)]">
              {kelas.creator.username}
            </p>
            <p className="text-xs text-[var(--dark-grey)] capitalize">
              {kelas.creator.role}
            </p>
          </div>
        </div>
      </div>
    </div>
    // <Card key={classData.id} className="overflow-hidden p-0" onClick={() => onClick && onClick()}>
    //   <CardContent className="p-0">
    //     <img
    //       src={classData.image_url || "/placeholder.svg"}
    //       alt={classData.name}
    //       className="w-full h-48 object-cover"
    //     />
    //     <div className="flex flex-col gap-4 p-4">
    //       <div className="flex items-center gap-2">
    //         <div className="flex items-center gap-3">
    //           <Avatar className="flex w-8 h-8 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
    //             <AvatarImage src={classData.creator.image_url || "/placeholder.svg"} />
    //             <AvatarFallback>{classData.creator.username[0].toUpperCase()}</AvatarFallback>
    //           </Avatar>
    //           <div>
    //             <p className="font-medium text-sm text-gray-900 line-clamp-1">{classData.creator.username}</p>
    //             <p className="text-xs text-gray-400 line-clamp-1">{classData.creator.role}</p>
    //           </div>
    //         </div>
    //       </div>
    //       <h3 className="font-semibold text-md mb-2 line-clamp-2 min-h-[3rem] text-left">{classData.name}</h3>
    //       <Button
    //         onClick={() => router.push(`/kelas/details/${classData.id}`)}
    //         className="flex-1 bg-black hover:bg-gray-800 text-white rounded-full">
    //         See Details
    //       </Button>
    //     </div>
    //   </CardContent>
    // </Card>
  )
}

export default ClassCard