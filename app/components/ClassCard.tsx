import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { ClassCardInterface } from "@/lib/types/classes"

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
          alt={classData.name}
          className="w-full h-48 object-cover"
        />
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <Avatar className="flex w-8 h-8 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
                <AvatarImage src={classData.creator.image_url || "/placeholder.svg"} />
                <AvatarFallback>{classData.creator.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm text-gray-900 line-clamp-1">{classData.creator.username}</p>
                <p className="text-xs text-gray-400 line-clamp-1">{classData.creator.role}</p>
              </div>
            </div>
          </div>
          <h3 className="font-semibold text-md mb-2 line-clamp-2 min-h-[3rem] text-left">{classData.name}</h3>
          <Button
            onClick={() => router.push(`/kelas/details/${classData.id}`)}
            className="flex-1 bg-black hover:bg-gray-800 text-white rounded-full">
            See Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClassCard