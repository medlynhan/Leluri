"use client"

import { CategoryFiltering } from "@/components/CategoryFilter"
import LoadingComponent from "@/components/LoadingComponent"
import { useGetClassCategories } from "@/lib/client-queries/classcategories"
import { useGetClasses } from "@/lib/client-queries/classes"
import { ClassCardInterface } from "@/lib/types/classes"
import { MinimalInfoUser } from "@/lib/types/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { useEffect, useState , useMemo} from "react"
import { FaX } from "react-icons/fa6"
import { FaSearch } from "react-icons/fa"
import Sidebar from "../../components/Sidebar"
import { Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const StarRating = ({ rating }: { rating: number }) => {
  const value = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0))
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = value >= i + 1
        return (
          <Star
            key={i}
            className={`w-4 h-4 ${
              filled ? "text-yellow-400 fill-yellow-400" : "text-[var(--medium-grey)]"
            }`}
          />
        )
      })}
      <span className="ml-2 text-sm text-[var(--black)]">{value.toFixed(1)}</span>
    </div>
  )
}

const Kelas = () => {
  const { data: classes = [], isLoading: isGetClassesLoading } = useGetClasses()
  const { data: classcategories = [], isLoading: isGetClassCategoriesLoading } = useGetClassCategories()

  const [users, setUsers] = useState<MinimalInfoUser[]>([])
  

  const [categoryFilterOpened, setCategoryFilterOpened] = useState(false)
  const [selectedClassCategories, setSelectedClassCategories] = useState<string[]>([])
  const [search, setSearch] = useState("")

  const router = useRouter();

const filteredClasses = useMemo(() => {
  let result = classes

  // filter by category
  if (selectedClassCategories.length > 0) {
    result = result.filter((c) => selectedClassCategories.includes(c.category_id))
  }

  // filter by search
  if (search.trim() !== "") {
    result = result.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  return result
}, [classes, selectedClassCategories, search])


const searchClass = (term: string) => {
  setSearch(term)
  if (term === "") {
    setUsers([])
    return
  }
  setUsers(
    classes
      .filter((classData) =>
        classData.creator.username.toLowerCase().includes(term.toLowerCase())
      )
      .map((classData) => classData.creator)
      .filter(
        (value, index, self) => index === self.findIndex((t) => t.id === value.id)
      )
  )
}


  const handleSearchChange = (input: string) => {
    setSearch(input)
    if (!input || input.length <= 0) {
      setFilteredClasses(classes)
    }
  }

  if (isGetClassCategoriesLoading)
    return <LoadingComponent message="Loading class category options ..." />
  if (isGetClassesLoading)
    return <LoadingComponent message="Loading available classes ..." />

  return (
    <div className="relative w-full h-full overflow-x-hidden">
      {/* Navbar */}
      <div className="absolute top-0 left-0 flex gap-4 justify-center items-center h-14 bg-[var(--white)] w-full z-5 fixed max-w-screen p-2 ">
        <Sidebar />

        {/* Search Bar */}
        <div className="flex justify-center items-center ml-10 lg:ml-64 relative flex-1 h-full">
          <input
            type="text"
            placeholder="Apa yang ingin kamu temukan?"
            className="w-full pl-12 pr-4 border border-gray-200 shadow-xs  rounded-full h-full"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchClass(search)}
          />
          <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--dark-grey)]" />
          {search.length > 0 && (
            <FaX
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 hover:bg-gray-100 p-1 rounded-full cursor-pointer"
              onClick={() => handleSearchChange("")}
            />
          )}
        </div>

        {/* Filter + Button */}
        <div className="hidden md:flex">
        <CategoryFiltering
          categories={classcategories}
          selectedCategories={selectedClassCategories}
          setSelectedCategories={setSelectedClassCategories}
          open={categoryFilterOpened}
          setOpen={setCategoryFilterOpened}
        />
        </div>
        <button
          onClick={() => searchClass(search)}
          className="h-full px-6 bg-[var(--yellow)] text-white rounded-full font-semibold hover:bg-transparent hover:border-[var(--yellow)] border border-transparent hover:text-[var(--black)] transition-colors"
        >
          Cari
        </button>
      </div>

      {/* List Classes */}
      <div className="ml-3 mr-3 lg:ml-68 grid grid-cols-[repeat(auto-fill,minmax(15em,1fr))] p-3 gap-3 lg:gap-6 mt-15   ">
        {filteredClasses.map((kelas) => (
          <div
            key={kelas.id}
            className="bg-[var(--white)] w-full rounded-2xl overflow-hidden border border-[var(--medium-grey)] cursor-pointer transition-transform duration-300 hover:-translate-y-1"
          >
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

              {/* Creator Info */}
              <div className="flex items-center pt-4 border-t border-[var(--medium-grey)]">
                <Avatar className="w-8 h-8">
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
        ))}
      </div>

      {/* Empty / No Results */}
      {(!classes || classes.length === 0) && (
          <div className="ml-3 mr-3 lg:ml-68 p-3 flex flex-col justify-center  items-center mt-10 max-w-[calc(100%-1rem)] mt-10 w-full lg:max-w-[calc(100%-18rem)]">
            <Image src="/no_result.png" width={300} height={300} alt="NO" />
            <p className="text-gray-500 text-base">Belum ada kelas</p>
          </div>
      )}
      {filteredClasses.length === 0 && classes.length > 0 && (
          <div className="ml-3 mr-3 lg:ml-68 p-3 flex flex-col justify-center  items-center mt-10 max-w-[calc(100%-1rem)] mt-10 w-full lg:max-w-[calc(100%-18rem)]">
            <Image src="/no_result.png" width={300} height={300} alt="NO" />
            <p className="text-gray-500 text-base">Yah, Kami tidak menemukan pencarian</p>
          </div>
      )}
    </div>
  )
}

export default Kelas
