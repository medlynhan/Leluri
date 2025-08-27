'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { FaPlus } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import PostPreview from '../../components/PostPreview';
import { X } from "lucide-react"


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

        const { data: postsData, error: postsError } = await supabase.from("posts").select("*").eq("user_id", user.id)

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-4 p-6 bg-white rounded-lg shadow-sm">
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">No profile found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Left Sidebar - Profile Info */}
        <div className="w-80 bg-white min-h-screen p-6 border-r border-gray-200">
          <div className="flex flex-col items-center text-center">
            {/* Profile Avatar */}
            <div className="relative mb-4">
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

            {/* Profile Info */}
            <p className="text-sm text-gray-500 mb-1">{displayProfile.role}</p>
            <h1 className="text-lg font-semibold text-gray-900 mb-3">{displayProfile.username}</h1>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{displayProfile.biography}</p>

            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditMode(true)}
              className="w-full py-2 px-4 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-6"
            >
              Edit Profile
            </button>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-4">
              <div className="text-center">
                <p className="font-semibold text-gray-900">{displayProfile.followers.length}</p>
                <p className="text-sm text-gray-500">pengikut</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">{displayProfile.following.length}</p>
                <p className="text-sm text-gray-500">mengikuti</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <IoLocationOutline className="w-4 h-4" />
              <span>{displayProfile.location}</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
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
                className="absolute top-0 right-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg"
              >
                <FaPlus className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="mb-6">
                <Image
                  src="/images/profile-empty-state.png"
                  alt="Empty state illustration"
                  width={200}
                  height={150}
                  className="opacity-60"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Mulai postingan pertama kamu</h3>
              <button
                onClick={() => router.push("/post")}
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Buat Postingan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Edit Profile</h2>
              <button
                onClick={() => setIsEditMode(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Avatar Upload */}
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
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <FaPlus className="w-3 h-3 text-gray-600" />
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

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={displayProfile.username}
                  onChange={(e) => setProfile({ ...displayProfile, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="madeline30_"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peran Anda</label>
                <select
                  value={displayProfile.role}
                  onChange={(e) => setProfile({ ...displayProfile, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option>pelajar budaya</option>
                  <option>Pengrajin</option>
                  <option>Sanggar Seni</option>
                  <option>Kolektor</option>
                </select>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={displayProfile.biography}
                  onChange={(e) => setProfile({ ...displayProfile, biography: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                  placeholder="Halo aku madeline, mahasiswa yang sedang belajar budaya. Tertarik untuk mendalam seni kerajinan tangan indonesia secara lebih dalam 🌸"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                <input
                  type="text"
                  value={displayProfile.location}
                  onChange={(e) => setProfile({ ...displayProfile, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Tangerang, Indonesia"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsEditMode(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateProfile}
                className="flex-1 py-2 px-4 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Preview Modal */}
      {selectedPost && <PostPreview post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  )
}

export default ProfilePage
