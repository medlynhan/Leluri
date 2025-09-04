"use client"

import { useEffect, useState, useMemo } from "react"
import { FaX, FaPlus } from "react-icons/fa6"
import Sidebar from "../../components/Sidebar"
import { CategoryFiltering } from "@/components/CategoryFilter"
import LoadingComponent from "@/components/LoadingComponent"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useGetPosts } from "@/lib/client-queries/posts"
import { useGetPostCategories } from "@/lib/client-queries/postcategories"
import PostCard from "@/components/PostCard"
import DetailedPostModal from "@/components/modal/DetailedPostModal"
import { MinimalInfoUser } from "@/lib/types/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { FaSearch } from "react-icons/fa"

const EksplorasiPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  const { data: posts = [], isLoading: isGetPostsLoading } = useGetPosts(user?.id)
  const { data: postcategories = [], isLoading: isGetPostCategoriesLoading } =
    useGetPostCategories()

  const [users, setUsers] = useState<MinimalInfoUser[]>([])
  const [selectedPostCategories, setSelectedPostCategories] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [postModalId, setPostModalId] = useState<string | null>(null)
  const [categoryFilterOpened, setCategoryFilterOpened] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUser(user)
      else router.push("/login")
    }
    fetchUser()
  }, [router])

  const filteredPosts = useMemo(() => {
    let result: DetailedPostWithMedia[] = posts
    if (selectedPostCategories.length > 0) {
      result = result.filter((p) => selectedPostCategories.includes(p.category_id))
    }
    if (search.trim() !== "") {
      result = result.filter((p) =>
        p.user.username.toLowerCase().includes(search.toLowerCase())
      )
    }
    return result
  }, [posts, selectedPostCategories, search])

  const searchUser = (term: string) => {
    setSearch(term)
    if (term === "") {
      setUsers([])
      return
    }
    setUsers(
      posts
        .filter((p) => p.user.username.toLowerCase().includes(term.toLowerCase()))
        .map((p) => p.user)
        .filter(
          (value, index, self) => index === self.findIndex((t) => t.id === value.id)
        )
    )
  }

  const handleSearchChange = (input: string) => {
    setSearch(input)
    if (!input || input.length <= 0) {
      setUsers([])
    }
  }

  if (isGetPostCategoriesLoading)
    return <LoadingComponent message="Loading post categories options..." />
  if (isGetPostsLoading) return <LoadingComponent message="Loading all posts..." />

  return (
    <div className="relative w-full h-full overflow-x-hidden">
      {/* Navbar ala Kelas */}
      <div className="absolute top-0 left-0 flex gap-4 justify-center items-center h-14 bg-[var(--white)] w-full z-5 fixed max-w-screen p-2 ">
        <Sidebar />

        {/* Search Bar */}
        <div className="flex justify-center text-black  items-center ml-10 lg:ml-64 relative flex-1 h-full">
          <input
            type="text"
            placeholder="Apa yang ingin kamu temukan?"
            className="w-full pl-12 pr-4 border border-gray-200 shadow-xs  rounded-full h-full"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchUser(search)}
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
            categories={postcategories}
            selectedCategories={selectedPostCategories}
            setSelectedCategories={setSelectedPostCategories}
            open={categoryFilterOpened}
            setOpen={setCategoryFilterOpened}
          />
        </div>
        <button
          onClick={() => searchUser(search)}
          className="h-full px-6 bg-[var(--yellow)] text-white rounded-full font-semibold hover:bg-transparent hover:border-[var(--yellow)] border border-transparent hover:text-[var(--black)] transition-colors"
        >
          Cari
        </button>
        <Button
          className="hidden md:flex h-full px-6 bg-[var(--yellow)] text-white rounded-full font-semibold hover:bg-transparent hover:border-[var(--yellow)] border border-transparent hover:text-[var(--black)] transition-colors"
          onClick={() => router.push("/post")}
        >
          <FaPlus className="mr-2" /> Buat Post
        </Button>
      </div>

      {/* User Search Result */}
      {users.length > 0 && (
        <div className="flex flex-col w-full px-12 mt-20">
          <span className="font-bold text-lg mb-4">Person ({users.length})</span>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 overflow-hidden p-1">
            {users.map((u) => (
              <div
                className="flex flex-col items-center max-w-48 justify-center p-4 shadow-md rounded-md"
                key={u.id}
              >
                <Avatar className="mb-2 w-18 h-18 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
                  <AvatarImage src={u.image_url || "/placeholder.svg"} />
                  <AvatarFallback>{u.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className="font-medium text-sm text-gray-900 line-clamp-1">{u.username}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{u.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="ml-3 mr-3 lg:ml-68 grid grid-cols-[repeat(auto-fill,minmax(20em,1fr))] p-3 gap-3 lg:gap-6 mt-20">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => setPostModalId(post.id)}
            userId={user?.id ?? ""}
          />
        ))}
      </div>

      {/* Empty States */}
      {(!posts || posts.length === 0) && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Image src="/logo/empty.png" width={200} height={200} alt="NO" />
          <p className="text-gray-500">No posts exist yet ...</p>
        </div>
      )}
      {filteredPosts.length === 0 && posts.length > 0 && users.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Image src="/logo/no_result.png" width={200} height={200} alt="NO" />
          <p className="text-gray-500">No search results ...</p>
        </div>
      )}

      {/* Modal */}
      {postModalId !== null && user && (
        <DetailedPostModal postId={postModalId} setPostModalId={setPostModalId} userId={user.id} />
      )}
    </div>
  )
}

export default EksplorasiPage
