'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import { FaPlus } from 'react-icons/fa6'
import { IoLocationOutline, IoLogoWhatsapp } from 'react-icons/io5'
import { LogOut, X } from 'lucide-react'
import { BookOpen, ShoppingBag } from 'lucide-react'
import SelectDropdown from '@/components/SelectDropdown'
import { useGetClassCategories } from '@/lib/client-queries/classcategories'
import { useGetProfile, useUpdateProfile } from '@/lib/client-queries/profile'
import { useGetProfilePosts } from '@/lib/client-queries/profilePosts'
import { useGetFollowerCounts } from '@/lib/client-queries/followerCounts'
import { useGetInventoryFlags } from '@/lib/client-queries/inventoryFlags'
import { useGetAchievements } from '@/lib/client-queries/achievements'
import LoadingComponent from '@/components/LoadingComponent'
import PostCard from '@/components/PostCard'
import DetailedPostModal from '@/components/modal/DetailedPostModal'
import { supabase } from '@/lib/supabase'
import { AchievementRow, evaluateAchievements, recordAction } from '@/lib/achievements'
import AchievementUnlockModal from '@/components/modal/AchievementUnlockModal'
import { useGetUserProfileById } from '@/lib/client-queries/users'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import FollowButton from '@/components/FollowButton'

export interface ProfileState {
  id?: string
  username: string
  role: string
  biography: string
  location: string
  image_url: string
  followers?: string[]
  following?: string[]
  phone_number: string
}

const ProfilePage: React.FC = () => {

  const { id } = useParams()
  const router = useRouter()
  
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileState>({
    id: '',
    username: '',
    role: '',
    biography: '',
    location: '',
    image_url: '',
    phone_number: '',
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [creatingType, setCreatingType] = useState<'product' | 'class' | null>(null)
  const [newProductName, setNewProductName] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')
  const [newProductDescription, setNewProductDescription] = useState('')

  const [newProductImageFile, setNewProductImageFile] = useState<File | null>(null)
  const [newProductStock, setNewProductStock] = useState('')
  const [newProductLength, setNewProductLength] = useState('')
  const [newProductWidth, setNewProductWidth] = useState('')
  const [newProductThickness, setNewProductThickness] = useState('')
  const [newClassName, setNewClassName] = useState('')
  const [newClassDescription, setNewClassDescription] = useState('')
  const [newClassCategory, setNewClassCategory] = useState<string|null>(null)
  const [savingNew, setSavingNew] = useState(false)
  const [achievements, setAchievements] = useState<AchievementRow[]>([])
  const [showAchievementsModal, setShowAchievementsModal] = useState(false)
  const [unlockQueue, setUnlockQueue] = useState<AchievementRow[]>([])

  const [postModalId, setPostModalId] = useState<string | null>(null)

  const badgeColors = ['#F5C518', '#C084FC', '#3B82F6', '#10B981', '#FB7185', '#F59E0B']
  const getBadgeColor = (index: number) => badgeColors[index % badgeColors.length]

  const { data: classcategories = [], isLoading: isGetClassCategoriesLoading, isError: isGetClassCategoriesError, error: getClassCategoriesError } = useGetClassCategories()
  const { data: userprofile, isLoading: isGetUserProfileLoading, isError: isGetUserProfileError, error: getUserProfileError } = useGetUserProfileById(Array.isArray(id) ? id[0] : id)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
    };
    load();
  }, [router]);

  const { data: profileData, isLoading: profileLoading } = useGetProfile(Array.isArray(id) ? id[0] : id);
  const { data: postsData, isLoading: postsLoading } = useGetProfilePosts(Array.isArray(id) ? id[0] : id);
  const { data: followerCounts } = useGetFollowerCounts(Array.isArray(id) ? id[0] : id);
  const { data: inventoryFlags } = useGetInventoryFlags(Array.isArray(id) ? id[0] : id);
  const { data: achievementsData } = useGetAchievements(Array.isArray(id) ? id[0] : id);
  const updateProfileMutation = useUpdateProfile();

  useEffect(() => { if (profileData) setProfile(profileData as any); }, [profileData]);
  useEffect(() => {
    if (achievementsData) {
      setAchievements(achievementsData.achievements);
      if (achievementsData.newlyUnlocked.length) setUnlockQueue(prev => [...prev, ...achievementsData.newlyUnlocked]);
    }
  }, [achievementsData]);
  useEffect(() => { if (!profileLoading && !postsLoading) setLoading(false); }, [profileLoading, postsLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleUpdateProfile = async () => {
    if (!user || !profile) return;
    setLoading(true); setError(null);
    updateProfileMutation.mutate({
      user_id: user.id,
      username: profile.username,
      role: profile.role,
      biography: profile.biography,
      location: profile.location,
      phone_number: profile.phone_number || null,
      avatarFile,
    }, {
      onSuccess: (data) => { setProfile(data as any); setIsEditMode(false); setLoading(false); },
      onError: (err: any) => { setError(err.message || 'Failed updating profile'); setLoading(false); }
    });
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
  <div className="flex-1 p-6 overflow-hidden">
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

  if (!userprofile) {
    return (
      <div className="min-h-screen bg-[var(--medium-grey)] flex items-center justify-center">
        <div className="bg-[var(--dark-grey)]">No profile found.</div>
      </div>
    )
  }

  if(isGetClassCategoriesLoading) return <LoadingComponent message="Loading class categories options..."/>
  if(isGetUserProfileLoading) return <LoadingComponent message="Loading user profile..."/>

  console.log(userprofile)

  return (
    <div className="flex w-full relative min-h-screen overflow-x-hidden">
      {(postModalId !== null) && user &&
      <DetailedPostModal postId={postModalId} setPostModalId={setPostModalId} userId={user.id}/>}

      <div className={`${isEditMode || showAddModal ? "fixed" : ""}  flex flex-col lg:flex-row h-full w-full`}>
        <div className="w-full min-h-[30vh] lg:min-h-[60vh] ml-0 lg:w-80 border-b lg:border-b-transparent lg:border-r border-[var(--medium-grey)] p-6 ">
          <div className="justify-center items-center w-full flex flex-col text-center w-full">
            <Avatar className="self-center flex w-24 h-24 border border-gray-500 rounded-full overflow-hidden justify-center items-center">
              <AvatarImage src={userprofile.image_url || "/placeholder.svg"} />
              <AvatarFallback className='text-5xl'>{userprofile.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <p className="text-sm text-[var(--dark-grey)] mt-3">{userprofile.role}</p>
            <h1 className="text-lg font-semibold text-[var(--black)] mb-3">{userprofile.username}</h1>
            <span className="text-xs w-full bg-white-100 rounded-xs p-2 mb-4 text-white-300 text-justify w-full min-h-[calc(1.25em*4)]">{userprofile.biography ?? "This user doesn't have any bio yet..."}</span>
            {userprofile.id === user?.id &&
            <button
              onClick={() => setIsEditMode(true)}
              className="self-center w-full max-w-[20em] py-2 px-4 border border-[var(--black)] cursor-pointer rounded-full text-sm  text-[var(--black)]  hover:bg-[var(--light-grey)] hover:border-transparent transition-colors mb-6">
              Edit Profile
            </button>}

      {(inventoryFlags?.hasProduct || inventoryFlags?.hasClass) && (
              <div className="w-full flex justify-center items-center flex-col gap-2 mb-4">
        {(userprofile.id === user?.id) && inventoryFlags?.hasProduct && (
                  <button
                    onClick={() => router.push('/toko/saya')}
                    className="w-full max-w-[20em] flex items-center justify-center gap-2 py-2 px-4 border border-[var(--black)] cursor-pointer rounded-full text-sm font-medium text-[var(--black)]  hover:bg-[var(--light-grey)] hover:border-transparent transition-colors"
                  ><ShoppingBag className='w-4'/> Produk Saya</button>
                )}
        {(userprofile.id === user?.id) && inventoryFlags?.hasClass && (
                  <button
                    onClick={() => router.push('/kelas/saya')}
                    className="w-full max-w-[20em] flex items-center justify-center gap-2 py-2 px-4 border border-[var(--black)] cursor-pointer rounded-full text-sm font-medium text-[var(--black)]  hover:bg-[var(--light-grey)]  hover:border-transparent  transition-colors"
                  ><BookOpen className='w-4'/>  Kelas Saya</button>
                )}
              </div>
            )}

            <div className="flex justify-center gap-8 mb-6">
              <button onClick={() => router.push('/profile/followers')} className="text-center hover:opacity-80 transition"
                disabled={userprofile.id !== user?.id}>
                <p className="font-semibold text-[var(--black)]">{(followerCounts?.followerCount) ?? 0}</p>
                <p className="text-sm text-[var(--dark-grey)]">pengikut</p>
              </button>
              <button onClick={()=>router.push('/profile/following')} className="text-center hover:opacity-80 transition"
                disabled={userprofile.id !== user?.id}>
                <p className="font-semibold text-[var(--black)]">{(followerCounts?.followingCount) ?? 0}</p>
                <p className="text-sm text-[var(--dark-grey)]">mengikuti</p>
              </button>
            </div>
            
            {(userprofile.location) && (
              <div className="flex items-center gap-2 text-sm   mb-2">
                <IoLocationOutline className="w-4 h-4" />
                <span>{userprofile.location}</span>
              </div>
            )}

            {(userprofile.phone_number) && (
              <div className="flex items-center gap-2 text-sm  text-[var(--black)] mb-6">
                <IoLogoWhatsapp className="w-4 h-4 text-green-500" />
                <span>{userprofile.phone_number }</span>
              </div>
            )}
            {userprofile.id === user?.id && <p
              className="  text-[var(--dark-grey)] mb-4 cursor-pointer hover:text-[var(--black)] underline"
              onClick={() => { setShowAddModal(true); setCreatingType(null); }}>
              + Tambah produk / kelas
            </p>}
            {userprofile.id === user?.id && <div className='flex w-full justify-center'>
                <button onClick={handleLogout} className="flex items-center p-3 my-2 w-full max-w-[20em] bg-[var(--light-grey)] justify-center text-left  cursor-pointer rounded-lg transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span className="ml-4 font-medium">Logout</span>
                </button>
            </div>}
            <div className="w-full max-w-[20em] mt-2 pt-4 border-t border-[var(--medium-grey)] text-left">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => achievements.length && setShowAchievementsModal(true)}
                  className={`text-base font-semibold flex items-center gap-1 text-[var(--black)] ${achievements.length ? 'hover:underline' : ''}`}
                  aria-label="Lihat semua pencapaian"
                >
                  Pencapaian
                </button>
                {achievements.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAchievementsModal(true)}
                    className="text-xs text-[var(--dark-grey)] hover:underline"
                  >Lihat semua</button>
                )}
              </div>
              {achievements.length === 0 ? (
                <p className="text-xs text-[var(--dark-grey)]">Belum ada pencapaian.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {achievements.slice(0,6).map((a,i) => {
                    const color = getBadgeColor(i)
                    return (
                      <div key={a.id} title={a.name} className="w-10 h-10 flex items-center justify-center">
                        {a.badge_icon ? (
                          <Image src={a.badge_icon.trim()} alt={a.name} width={40} height={40} className="object-contain" />
                        ) : (
                          <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white overflow-hidden shadow-sm" style={{ borderColor: color }}>
                            <span className="text-[9px] px-1 leading-tight text-center font-medium" style={{ color }}>{a.name.split(' ').slice(0,2).join(' ')}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-screen p-6 ">

      {postsData && postsData.length > 0 ? (
            <div className="relative">
              <div className="grid grid-cols-3 gap-4">
        {postsData.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    userId={user?.id || ''}
                    onClick={() => setPostModalId(post.id)}
                    hideActions
                  />
                ))}
              </div>
              {userprofile.id === user?.id && (
                <button
                  onClick={() => router.push("/post")}
                  className="absolute top-0 right-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-[var(--dark-grey)] transition-colors shadow-lg"
                >
                  <FaPlus className="w-5 h-5" />
                </button>
              )}
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
              {userprofile.id === user?.id ? (
                <>
                  <h3 className="text-lg font-medium text-[var(--dark-grey)] mb-2">Mulai postingan pertama kamu</h3>
                  <button
                    onClick={() => router.push("/post")}
                    className="px-6 py-2 bg-black text-white rounded-full hover:bg-[var(--dark-grey)] transition-colors"
                  >
                    Buat Postingan
                  </button>
                </>
              ) : (
                <h3 className="text-lg font-medium text-[var(--dark-grey)] mb-2">Belum ada postingan.</h3>
              )}
            </div>
          )}
        </div>
      </div>

  {isEditMode && (
        <div className="absolute flex top-0 left-0 min-w-full min-h-full bg-black/70  items-center justify-center z-50 ">
          <div className="bg-white rounded-2xl  grid gap-4 min-h-[50%] lg:min-w-[40%] min-w-[80%]   p-6  my-10 ">
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
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br  p-1">
                    <Image
                      src={
                        avatarFile
                          ? URL.createObjectURL(avatarFile)
                          : userprofile.image_url || "/placeholder.svg?height=88&width=88&query=profile avatar"
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
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--medium-grey)] rounded-lg "
                  placeholder={userprofile.username ?? "madeline30_"}
                />
              </div>

              <div className='relative'>
                <label className="block text-sm font-medium text-[var(--black)] mb-2">Peran Anda</label>
                <select
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--medium-grey)] rounded-lg">
                  <option value="Pelajar Budaya">Pelajar Budaya</option>
                  <option value="Pengrajin">Pengrajin</option>
                  <option value="Sanggar Seni">Sanggar Seni</option>
                  <option value="Kolektor">Kolektor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-2">Bio</label>
                <textarea
                  value={profile?.biography ?? ''}
                  onChange={(e) => setProfile({ ...profile, biography: e.target.value })}
                  className="text-sm w-full px-3 py-2 border border-[var(--medium-grey)] rounded-lg "
                  rows={3}
                  placeholder={(userprofile.biography === null || userprofile.biography?.length <= 0) ? "Halo aku madeline, mahasiswa yang sedang belajar budaya. Tertarik untuk mendalam seni kerajinan tangan indonesia secara lebih dalam 🌸" : (userprofile.biography ?? '')}
                />
              </div>

              <div>
                <label className="block text-sm  text-[var(--black)] mb-2">Lokasi</label>
                <input
                  type="text"
                  value={profile?.location ?? ''}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--medium-grey)] rounded-lg "
                  placeholder={userprofile.location ?? "Tangerang, Indonesia"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--black)] mb-2">Nomor WhatsApp</label>
                <input
                  type="text"
                  value={profile?.phone_number}
                  onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--medium-grey)] rounded-lg "
                  placeholder={userprofile.phone_number || "0812xxxxxxxx"}
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

  {showAchievementsModal && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAchievementsModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAchievementsModal(false)} className="absolute top-3 right-3 p-1 rounded-full hover:bg-[var(--light-grey)]" aria-label="Tutup"><X className="w-5 h-5"/></button>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"> Pencapaian</h2>
            {achievements.length === 0 ? <p className="text-sm text-[var(--dark-grey)]">Belum ada pencapaian.</p> : (
              <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {achievements.map((a,i) => {
                  const color = getBadgeColor(i)
                  return (
                    <li key={a.id} className="flex gap-3 items-center border border-[var(--medium-grey)] rounded-lg p-3">
                      {a.badge_icon ? (
                        <Image src={a.badge_icon.trim()} alt={a.name} width={48} height={48} className="object-contain" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 shadow-sm" style={{ borderColor: color }}>
                          <span className="text-[10px] text-center px-1 leading-tight font-medium" style={{ color }}>{a.name}</span>
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium" style={{ color }}>{a.name}</p>
                        <p className="text-[11px] text-[var(--dark-grey)] leading-snug">{a.description}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      )}

  {showAddModal && (
        <div className="absolute  flex top-0 left-0 min-w-full min-h-full bg-black/70  items-center justify-center z-50">
          <div className="bg-white rounded-2xl  grid gap-4 min-h-[50%] lg:min-w-[40%] lg:max-w-[50%] min-w-[70%] max-w-[95%] p-6  my-10 ">
    {!creatingType && (
        <div className="relative">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="absolute top-0 right-0 p-1 rounded-full  hover:bg-[var(--medium-grey)] transition-colors"
                    aria-label="Tutup"
                  >
                    <X className="w-5 h-5 " />
                  </button>
                  <h2 className="text-lg font-semibold mb-6 text-[var(--black)]">Pilih Tipe</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setCreatingType('product')}
                      className="border border-[var(--medium-grey)] rounded-xl p-4 hover:bg-[var(--light-grey)] flex flex-col items-center gap-2"
                    >
                      <Image
                        src={"/buat-produk-baru.png"}
                        alt="Tambah Produk Baru"
                        width={200}
                        height={200}
                        className="object-cover w-full h-full rounded-lg"
                      />
                      <span className="text-sm font-medium text-[var(--black)] font-semibold">Produk</span>
                      <span className="text-xs text-center text-[var(--black)]">
                        Tambahkan produk baru
                      </span>
                    </button>

                    <button
                      onClick={() => setCreatingType('class')}
                      className="border border-[var(--medium-grey)] rounded-xl p-4 hover:bg-[var(--light-grey)] flex flex-col items-center gap-2"
                    >
                      <Image
                        src={"/buat-kelas-baru.png"}
                        alt="Tambah Kelas Baru"
                        width={200}
                        height={200}
                        className="object-cover w-full h-full rounded-lg"
                      />
                      <span className="text-sm font-medium text-[var(--black)] font-semibold">Kelas</span>
                      <span className="text-xs text-center text-[var(--black)]">
                        Buat kelas baru
                      </span>
                    </button>
                  </div>
                </div>

            )}

            {creatingType === 'product' && (
              <div className=''>
                <h2 className="text-lg font-semibold mb-4 w-full">Produk Baru</h2>
                <div className="space-y-4 text-sm w-full">
                  <div>
                    <label className="block   font-medium  text-[var(--black)] mb-1">Gambar Produk</label>
                    <div className="flex items-center gap-3 ">
                      <div className="w-25 h-25 rounded-lg border flex items-center justify-center overflow-hidden bg-[var(--light-grey)] text-(var[--dark-grey])">
                        {newProductImageFile ? (
                          <Image
                            src={URL.createObjectURL(newProductImageFile)}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <p>Preview</p>
                        )}
                      </div>
                      <label className="  px-3 py-2 border rounded-full cursor-pointer hover:bg-[var(--light-grey)]">
                        Pilih File
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) setNewProductImageFile(e.target.files[0])
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block   font-medium  text-[var(--black)] mb-1">Nama Produk</label>
                    <input value={newProductName} onChange={e => setNewProductName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Contoh: Tas Batik" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block   font-medium  text-[var(--black)] mb-1">Harga (Rp)</label>
                      <input type="number" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="50000" />
                    </div>
                    <div>
                      <label className="block   font-medium  text-[var(--black)] mb-1">Stok</label>
                      <input type="number" value={newProductStock} onChange={e => setNewProductStock(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block   font-medium  text-[var(--black)] mb-1">Panjang (cm)</label>
                      <input type="number" value={newProductLength} onChange={e => setNewProductLength(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="20" />
                    </div>
                    <div>
                      <label className="block   font-medium  text-[var(--black)] mb-1">Lebar (cm)</label>
                      <input type="number" value={newProductWidth} onChange={e => setNewProductWidth(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="15" />
                    </div>
                    <div>
                      <label className="block   font-medium  text-[var(--black)] mb-1">Ketebalan (cm)</label>
                      <input type="number" value={newProductThickness} onChange={e => setNewProductThickness(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="2" />
                    </div>
                  </div>
                  <div>
                    <label className="block  font-medium  text-[var(--black)] mb-1">Deskripsi</label>
                    <textarea value={newProductDescription} onChange={e => setNewProductDescription(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm resize-none h-24" placeholder="Jelaskan produk kamu" />
                  </div>
                  <p className="text-center w-full text-[var(--red)]">Semua field wajib diisi.</p>
                </div>
                <div className="flex gap-3 mt-6 text-sm">
                  <button onClick={() => setCreatingType(null)} className="flex-1 border rounded-full py-2 hover:bg-[var(--light-grey)] border  hover:border-transparent">Kembali</button>
                  <button
                    disabled={savingNew || !newProductImageFile || !newProductName || !newProductPrice || !newProductDescription || !newProductStock || !newProductLength || !newProductWidth || !newProductThickness}
                    onClick={async () => {
                      if (!user || !newProductImageFile) return; setSavingNew(true);
                      try {
                        const bucket = 'products';
                        const ext = newProductImageFile.name.split('.').pop();
                        const fileName = `${user.id}-${Date.now()}.${ext}`;
                        const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, newProductImageFile);
                        if (uploadError) throw uploadError;
                        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
                        await supabase.from('product').insert({
                          name: newProductName,
                          price: Number(newProductPrice),
                          description: newProductDescription,
                          user_id: user.id,
                          image_url: publicUrl,
                          stock: Number(newProductStock),
                          length: Number(newProductLength),
                          width: Number(newProductWidth),
                          thickness: Number(newProductThickness)
                        });
                        try {
                          await recordAction(user.id, 'add_product');
                          if (!(inventoryFlags?.hasProduct) && !(inventoryFlags?.hasClass)) await recordAction(user.id, 'open_store');
                          const newly2 = await evaluateAchievements(user.id);
                          if (newly2.length) { setAchievements(prev => [...prev, ...newly2]); setUnlockQueue(prev => [...prev, ...newly2]); }
                        } catch {}
                        setNewProductName(''); setNewProductPrice(''); setNewProductDescription('');
                        setNewProductImageFile(null); setNewProductStock(''); setNewProductLength(''); setNewProductWidth(''); setNewProductThickness('');
                        setShowAddModal(false);
                      } catch (e) {
                        console.error(e);
                      } finally {
                        setSavingNew(false);
                      }
                    }}
                    className="flex-1 bg-[var(--black)] text-white rounded-full py-2 hover:bg-[var(--dark-grey)]"
                  >{savingNew ? 'Menyimpan...' : 'Simpan'}</button>
                </div>
              </div>
            )}
            {creatingType === "class" && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Kelas Baru</h2>

                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block font-medium text-[var(--black)] mb-1">
                      Gambar Kelas
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-25 h-25 rounded-lg border flex items-center justify-center overflow-hidden bg-[var(--light-grey)] text-(var[--dark-grey])">
                        {newProductImageFile ? (
                          <Image
                            src={URL.createObjectURL(newProductImageFile)}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <p>Preview</p>
                        )}
                      </div>
                      <label className="px-3 py-2 border rounded-full cursor-pointer hover:bg-[var(--light-grey)]">
                        Pilih File
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              console.log("File dipilih:", e.target.files[0]);
                              setNewProductImageFile(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-[var(--black)] mb-1">
                      Nama / Judul Kelas
                    </label>
                    <input
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      placeholder="Contoh: Belajar Batik"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[var(--black)] mb-1">
                      Deskripsi
                    </label>
                    <textarea
                      value={newClassDescription}
                      onChange={(e) => setNewClassDescription(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm resize-none h-24"
                      placeholder="Jelaskan kelas kamu"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-[var(--black)] mb-2">
                      Post Category
                    </label>
                    <SelectDropdown 
                    options={classcategories ?? []}
                    value={newClassCategory}
                    onChange={(id : string) => setNewClassCategory(id)}
                    className="w-full"/>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 text-sm">
                  <button
                    onClick={() => setCreatingType(null)}
                    type="button"
                    className="flex-1 border rounded-full py-2 hover:bg-[var(--light-grey)]"
                  >
                    Kembali
                  </button>

                  <button
                    disabled={savingNew || !newProductImageFile || !newClassName}
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!user || !newProductImageFile) return;
                      setSavingNew(true);

                      try {
                        console.log("Menyimpan kelas baru...");

                        const bucket = "classes";
                        const ext = newProductImageFile.name.split(".").pop();
                        const fileName = `${user.id}-${Date.now()}.${ext}`;

                        const { error: uploadError } = await supabase.storage
                          .from(bucket)
                          .upload(fileName, newProductImageFile);

                        if (uploadError) throw uploadError;

                        const { data: { publicUrl } } = supabase.storage
                          .from(bucket)
                          .getPublicUrl(fileName);

                        const { data, error: insertError } = await supabase
                          .from("classes")
                          .insert({
                            name: newClassName,
                            description: newClassDescription,
                            user_id: user.id,
                            image_url: publicUrl,
                            created_at: new Date().toISOString(),
                            category_id: newClassCategory
                          })
                          .select();

                        if (insertError) throw insertError;

                        console.log("Insert berhasil:", data);

                        setNewClassName("");
                        setNewClassDescription("");
                        setNewProductImageFile(null);
                        setShowAddModal(false);

                        try {
                          await recordAction(user.id, "create_class");
                          if (!(inventoryFlags?.hasProduct) && !(inventoryFlags?.hasClass)) {
                            await recordAction(user.id, "open_store");
                          }
                          const newly3 = await evaluateAchievements(user.id);
                          if (newly3.length) {
                            setAchievements((prev) => [...prev, ...newly3]);
                            setUnlockQueue((prev) => [...prev, ...newly3]);
                          }
                        } catch {}
                      } catch (err) {
                        console.error("Gagal menambahkan kelas:", err);
                        alert("Gagal menambahkan kelas, cek console log!");
                      } finally {
                        setSavingNew(false);
                      }
                    }}
                    className="flex-1 bg-[var(--black)] text-white rounded-full py-2 hover:bg-[var(--dark-grey)]"
                  >
                    {savingNew ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <AchievementUnlockModal
        queue={unlockQueue.map(a => ({ id: a.id, name: a.name, description: a.description, badge_icon: a.badge_icon }))}
        onClose={(id) => setUnlockQueue(q => q.filter(x => x.id !== id))}
      />


    </div>
  )
}

export default ProfilePage