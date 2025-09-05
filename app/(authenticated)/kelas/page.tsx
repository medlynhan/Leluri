"use client"

import { CategoryFiltering } from "@/components/CategoryFilter"
import ClassCard from "@/components/ClassCard"
import FollowButton from "@/components/FollowButton"
import LoadingComponent from "@/components/LoadingComponent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGetClassCategories } from "@/lib/client-queries/classcategories"
import { useGetClasses } from "@/lib/client-queries/classes"
import { supabase } from "@/lib/supabase"
import { ClassCardInterface } from "@/lib/types/classes"
import { MinimalInfoUser } from "@/lib/types/users"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { User } from "@supabase/supabase-js"
import { Search } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { FaX } from "react-icons/fa6"

const Kelas = () => {

  const router = useRouter()
  const [user, setUser] = useState<User|null>(null)

  useEffect(() => {
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUser(user);
        } else {
            router.push('/login');
        }
    };
    fetchUser();
    }, [router]);

  const { data: classes = [], isLoading: isGetClassesLoading, isError: isGetClassesError, error: getClassesError } = useGetClasses()
  const { data: classcategories = [], isLoading: isGetClassCategoriesLoading, isError: isGetClassCategoriesError, error: getClassCategoriesError } = useGetClassCategories()

  const [users, setUsers] = useState<MinimalInfoUser[]>([])
  const [filteredClasses, setFilteredClasses] = useState<ClassCardInterface[]>([])

  const [categoryFilterOpened, setCategoryFilterOpened] = useState<boolean>(false)
  const [selectedClassCategories, setSelectedClassCategories] = useState<string[]>([]);

  useEffect(() => {
    if(classes && classes.length > 0) setFilteredClasses(classes)
  }, [classes])

  useMemo(() => {
    if (selectedClassCategories.length > 0) {
      const filtered = classes.filter((c) =>
        selectedClassCategories.includes(c.category_id)
      );
      setFilteredClasses(filtered);
    } else {
      setFilteredClasses(classes);
    }
  }, [selectedClassCategories]);

  const [search, setSearch] = useState<string>('')
  const searchClass = (search : string) => {
    if(search === '') return
    setFilteredClasses(
      classes.filter((classData) => classData.name.toLowerCase().includes(search.toLowerCase()))
    )
    setUsers(
      classes
      .filter((classData) => 
        classData.creator.username?.toLowerCase().includes(search.toLowerCase()) && classData.creator.id !== user?.id
      )
      .map((classData) => classData.creator)
      .filter((value, index, self) => index === self.findIndex((t) => t.id === value.id))
    )
  }

  const handleSearchChange = (input : string) => {
    setSearch(input)
    if(!input || input.length <= 0){
      setFilteredClasses(classes)
    }
  }

  if(isGetClassCategoriesLoading) return <LoadingComponent message="Loading class category options ..."/>
  if(isGetClassesLoading) return <LoadingComponent message="Loading available classes ..."/>

  return (
    <div className="flex flex-col w-full h-full">
      <div className="sticky top-0 flex flex-row items-center gap-4 p-6 z-1 bg-white">
        <div className="relative w-full ml-20">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Apa yang ingin kamu temukan ?"
            className="pl-12 py-3 text-base border-gray-300 bg-white"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {search.length > 0 && (
            <FaX 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 hover:bg-gray-100 p-1 rounded-full"
            onClick={() => handleSearchChange('')}/>
          )}
        </div>
        <CategoryFiltering 
        categories={classcategories}
        selectedCategories={selectedClassCategories}
        setSelectedCategories={setSelectedClassCategories}
        open={categoryFilterOpened}
        setOpen={setCategoryFilterOpened}/>
        <Button
        className="px-8 py-3 bg-orange-400 hover:bg-orange-500 text-white font-medium"
        onClick={() => searchClass(search)}>
          Cari
        </Button>
      </div>

      {users.length > 0 &&
      <div className="flex flex-col w-full px-12">
        <span className="font-bold text-lg mb-4">Person ({users.length})</span>
        <div className="grid grid-cols-6 gap-3 overflow-hidden p-1">
          {users.map((userSearched) => (
            <div 
            className="flex flex-col items-center max-w-48 justify-center p-4 shadow-md rounded-md" 
            key={userSearched.id}
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/profile/${userSearched.id}`)
            }}>
              <Avatar className="mb-2 w-18 h-18 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
                <AvatarImage src={userSearched.image_url || "/placeholder.svg"} />
                <AvatarFallback>{userSearched.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="font-medium text-sm text-gray-900 line-clamp-1">{userSearched.username}</p>
              <p className="text-xs text-gray-500 line-clamp-1">{userSearched.role}</p>
              {user &&
              <FollowButton
              userId={user.id}
              followed={userSearched.followed ?? false}
              followedUserId={userSearched.id}
              className="mt-2"/>}
            </div>
          ))}
        </div>
      </div>}

      {/* List Classes */}
      <div className="flex flex-col w-full px-12 pt-6 pb-18">
        <span className="font-bold text-lg mb-4">Classes ({filteredClasses.length})</span>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(15em,1fr))] gap-3 lg:gap-6">
          {filteredClasses.map((kelas, idx) => (
            <ClassCard key={idx} kelas={kelas}/>
          ))}
        </div>
      </div>

      {/* Empty / No Results */}
      {(!classes || classes.length === 0) && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Image src="/logo/empty.png" width={200} height={200} alt="NO" />
          <p className="text-gray-500">No classes exist yet ...</p>
        </div>
      )}
      {filteredClasses.length === 0 && classes.length > 0 && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Image src="/logo/no_result.png" width={200} height={200} alt="NO" />
          <p className="text-gray-500">No search results ...</p>
        </div>
      )}

      {/* {(!classes || classes.length <= 0) ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Image src="/empty.png" width={200} height={200} alt="NO"/>
          <p className="text-gray-500">No classes exist yet ...</p>
        </div>
      ) : (filteredClasses.length <= 0 && users.length <= 0) ? (
        <div className="flex items-center justify-center flex-col w-full h-full">
          <Image src="/no_result.png" width={200} height={200} alt="NO"/>
          <p className="text-gray-500">No search results ...</p>
        </div>
      ) : (
        <div className="flex flex-col w-full px-12 pb-12 pt-4">
          <span className="font-bold text-lg mb-4">Class ({classes.length})</span>
          <div className="grid grid-cols-3 gap-6 overflow-hidden h-0 flex-1 p-1">
            {filteredClasses.map((c) => (
              <ClassCard key={c.id} classData={c}/>
            ))}
          </div>
        </div>
      )} */}
    </div>
  )
}

export default Kelas
