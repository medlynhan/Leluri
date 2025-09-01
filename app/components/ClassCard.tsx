import { Class } from "@/lib/types"
import { Card, CardContent } from "./ui/card"
import { MinimalInfoUser } from "@/lib/types/user"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

export interface ClassCardInterface extends Class {
  creator: MinimalInfoUser
}

interface ClassCardInternalInterface {
  classData : ClassCardInterface
  onClick?: () => void
}

const ClassCard = ({
  classData,
  onClick
} : ClassCardInternalInterface) => {

  const router = useRouter()

  return (
    <Card key={classData.id} className="overflow-hidden p-0" onClick={() => onClick && onClick()}>
      <CardContent className="p-0">
        <img
          src={classData.image_url || "/placeholder.svg"}
          alt={classData.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-md mb-2 line-clamp-2 min-h-[3rem] text-left">{classData.title}</h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
                <AvatarImage src={classData.creator.image_url || "/placeholder.svg"} />
                <AvatarFallback>{classData.creator.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm text-gray-900 line-clamp-1">{classData.creator.username}</p>
                <p className="text-xs text-gray-400 line-clamp-1">{classData.creator.role}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full gap-2">
            <Button
              onClick={() => router.push(`/kelas/details/${classData.id}`)}
              className="flex-1 bg-black hover:bg-gray-800 text-white rounded-full">
              See Details
            </Button>
            <Button
              onClick={() => router.push(`/kelas/registration/${classData.id}`)}
              className="flex-1 bg-black hover:bg-gray-800 text-white rounded-full">
              Daftar Kelas
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClassCard