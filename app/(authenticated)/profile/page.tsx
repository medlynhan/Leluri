'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { FaPlus } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import PostPreview from '../../components/PostPreview';
import { LogOut, X } from "lucide-react"
import Sidebar from '../../components/Sidebar';



interface Post {
  id: string
  user_id: string
  description: string
  image_url: string
  created_at: string
  likes: number
  category: string
}

interface ProfileState {
  username: string
  role: string
  biography: string
  location: string
  image_url: string
  followers: string[]
  following: string[]
}

const ProfilePage: React.FC = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileState | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data, error } = await supabase.from("users").select("*").eq("id", user.id).maybeSingle()

        if (error) {
          setError(error.message)
        } else if (data) {
          setProfile(data)
        }

        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (postsError) {
          setError(postsError.message)
        } else if (postsData) {
          setPosts(postsData)
        }
      } else {
        router.push("/Login")
      }
      setLoading(false)
    }

    fetchUserAndPosts()
  }, [router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/Login')
  }

  const handleUpdateProfile = async () => {
    if (!user || !profile || !supabase) return

    setLoading(true)
    setError(null)

    let imageUrl = profile.image_url

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop()
      const fileName = `${user.id}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true })

      if (uploadError) {
        setError(uploadError.message)
        setLoading(false)
        return
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath)
      imageUrl = publicUrl
    }

    const { error: dbError } = await supabase
      .from("users")
      .update({
        username: profile.username,
        role: profile.role,
        biography: profile.biography,
        location: profile.location,
        image_url: imageUrl,
      })
      .eq("id", user.id)

    if (dbError) {
      setError(dbError.message)
    } else {
      setProfile({ ...profile, image_url: imageUrl })
      setIsEditMode(false)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex animate-pulse">
        <div className="w-80 min-h-screen p-6 border-r border-[var(--medium-grey)]">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-[var(--medium-grey)]"></div>
            </div>
            <div className="h-4 bg-[var(--medium-grey)] rounded w-20 mb-3"></div>
            <div className="h-4 bg-[var(--medium-grey)] rounded w-48 mb-4"></div>
            <div className="h-10 bg-[var(--medium-grey)] rounded-full w-full mb-6"></div>
            <div className="flex justify-center gap-8 mb-4">
              <div className="text-center">
                <div className="h-4 bg-[var(--medium-grey)] rounded w-8 mb-2"></div>
                <div className="h-3 bg-[var(--medium-grey)] rounded w-12"></div>
              </div>
              <div className="text-center">
                <div className="h-4 bg-[var(--medium-grey)] rounded w-8 mb-2"></div>
                <div className="h-3 bg-[var(--medium-grey)] rounded w-12"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-square bg-[var(--medium-grey)] rounded-lg"></div>
            <div className="aspect-square bg-[var(--medium-grey)] rounded-lg"></div>
            <div className="aspect-square bg-[var(--medium-grey)] rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-lg mx-4 p-6 bg-white rounded-lg shadow-sm">
          <div className="text-red-600 mb-4">Error: {error}</div>
        </div>
      </div>
    )
  }

  const mockProfile = {
    username: "madeline30_",
    role: "pelajar budaya",
    biography:
      "Halo aku madeline, mahasiswa yang sedang belajar budaya. Tertarik untuk mendalam seni kerajinan tangan indonesia secara lebih dalam 🌸",
    location: "Tangerang, Indonesia",
    image_url: "/diverse-profile-avatars.png",
    followers: [],
    following: [],
  }

  const displayProfile = profile || mockProfile

  if (!displayProfile) {
    return (
      <div className="min-h-screen bg-[var(--medium-grey)] flex items-center justify-center">
        <div className="bg-[var(--dark-grey)]">No profile found.</div>
      </div>
    )
  }

  return (
    <div className={`  relative min-h-screen bg-white overflow-x-hidden`}>
      <div className={`${isEditMode ? "fixed" : ""}  flex flex-col lg:flex-row  h-full w-full `}>

        {/*Sidebar */}
          <Sidebar />

        {/*Profile */}
        <div className="w-screen min-h-[30vh] min-h-[60vh] ml-0 lg:w-80  border-b lg:border-r border-[var(--medium-grey)] lg:ml-64 bg-white lg:h-screen p-6 ">
          <div className="w-full flex flex-col items-center text-center">
            <div className="justify-items items-center relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 p-1">
                <Image
                  src={displayProfile.image_url || "/placeholder.svg?height=88&width=88&query=profile avatar"}
                  alt="Profile"
                  width={88}
                  height={88}
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              </div>
            </div>

            <p className="text-sm text-[var(--dark-grey)] mb-1">{displayProfile.role}</p>
            <h1 className="text-lg font-semibold text-[var(--black)] mb-3">{displayProfile.username}</h1>
            <p className="text-sm  mb-4 leading-relaxed text-justify w-full max-w-[20em]">{displayProfile.biography}</p>

            <button
              onClick={() => setIsEditMode(true)}
              className="w-full max-w-[20em] py-2 px-4 border border-[var(--black)] cursor-pointer rounded-full text-sm  text-[var(--black)] transition-colors mb-6"
            >
              Edit Profile
            </button>

            <div className="flex justify-center gap-8 mb-4">
              <div className="text-center">
                <p className="font-semibold text-[var(--black)]">{displayProfile.followers.length}</p>
                <p className="text-sm text-[var(--dark-grey)]">pengikut</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-[var(--black)]">{displayProfile.following.length}</p>
                <p className="text-sm text-[var(--dark-grey)]">mengikuti</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm  ">
              <IoLocationOutline className="w-4 h-4" />
              <span>{displayProfile.location}</span>
            </div>
            <div>
                <button onClick={handleLogout} className="flex items-center p-3 my-2 w-full text-left hover:text-[var(--medium-grey)] rounded-lg transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span className="ml-4 font-medium">Logout</span>
                </button>
            </div>
          </div>
        </div>


        {/*Postingan */}
        <div className="flex-1 min-h-screen p-6 ">
          {posts.length > 0 ? (
            <div className="relative">
              <div className="grid grid-cols-3 gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="aspect-square cursor-pointer rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedPost(post)}
                  >
                    <Image
                      src={post.image_url || "/placeholder.svg"}
                      alt={post.description}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push("/post")}
                className="absolute top-0 right-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-[var(--dark-grey)] transition-colors shadow-lg"
              >
                <FaPlus className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center h-96 text-center">
              <div className="mb-6">
                <Image
                  src="/profile-empty.png"
                  alt="Empty state illustration"
                  width={300}
                  height={150}
                  className="opacity-60"
                />
              </div>
              <h3 className="text-lg font-medium text-[var(--dark-grey)] mb-2">Mulai postingan pertama kamu</h3>
              <button
                onClick={() => router.push("/post")}
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-[var(--dark-grey)] transition-colors"
              >
                Buat Postingan
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditMode && (
        <div className="absolute flex top-0 left-0 min-w-full min-h-full bg-black/70  items-center justify-center z-50 ">
          <div className="bg-white rounded-2xl  grid gap-4 min-h-[50%] lg:min-w-[40%] min-w-[60%]  p-6  lg:my-10 ">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Edit Profile</h2>
              <button
                onClick={() => setIsEditMode(false)}
                className="p-1 hover:bg-[var(--medium-grey)] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 p-1">
                    <Image
                      src={
                        avatarFile
                          ? URL.createObjectURL(avatarFile)
                          : displayProfile.image_url || "/placeholder.svg?height=88&width=88&query=profile avatar"
                      }
                      alt="Profile"
                      width={88}
                      height={88}
                      className="w-full h-full rounded-full object-cover bg-white"
                    />
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border-2 border-[var(--medium-grey)] rounded-full flex items-center justify-center cursor-pointer hover:border-[var(--medium-grey)] transition-colors"
                  >
                    <FaPlus className="w-3 h-3 text-[var(--dark-grey)]" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-2">Username</label>
                <input
                  type="text"
                  value={displayProfile.username}
                  onChange={(e) => setProfile({ ...displayProfile, username: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--medium-grey)] rounded-lg "
                  placeholder="madeline30_"
                />
              </div>

              <div className='relative'>
                <label className="block text-sm font-medium text-[var(--black)] mb-2">Peran Anda</label>
                <select
                  value={displayProfile.role}
                  onChange={(e) => setProfile({ ...displayProfile, role: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--medium-grey)] rounded-lg "
                >
                  <option className=''>pelajar budaya</option>
                  <option>Pengrajin</option>
                  <option>Sanggar Seni</option>
                  <option>Kolektor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-2">Bio</label>
                <textarea
                  value={displayProfile.biography}
                  onChange={(e) => setProfile({ ...displayProfile, biography: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--medium-grey)] rounded-lg "
                  rows={3}
                  placeholder="Halo aku madeline, mahasiswa yang sedang belajar budaya. Tertarik untuk mendalam seni kerajinan tangan indonesia secara lebih dalam 🌸"
                />
              </div>

              <div>
                <label className="block text-sm  text-[var(--black)] mb-2">Lokasi</label>
                <input
                  type="text"
                  value={displayProfile.location}
                  onChange={(e) => setProfile({ ...displayProfile, location: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--medium-grey)] rounded-lg "
                  placeholder="Tangerang, Indonesia"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsEditMode(false)}
                className="flex-1 py-2 px-4 border border-[var(--black)] rounded-full text-sm font-medium text-[var(--black)]  cursor-pointer  transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateProfile}
                className="flex-1 py-2 px-4 bg-black text-white rounded-full text-sm font-medium border border-transparent cursor-pointer hover:bg-[var(--dark-grey)] transition-colors"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPost && (
        <PostPreview
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onPostUpdated={(updated) => {
            setPosts(p => p.map(pt => pt.id === updated.id ? updated : pt));
            setSelectedPost(updated);
          }}
          onPostDeleted={(deletedId) => {
            setPosts(p => p.filter(pt => pt.id !== deletedId));
            setSelectedPost(null);
          }}
        />
      )}
    </div>
  )
}

export default ProfilePage
