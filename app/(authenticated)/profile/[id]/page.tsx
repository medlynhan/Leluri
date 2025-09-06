'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import { IoLocationOutline, IoLogoWhatsapp } from 'react-icons/io5'
import { LogOut } from 'lucide-react'
import { useGetClassCategories } from '@/lib/client-queries/classcategories'
import { useGetProfile } from '@/lib/client-queries/profile'
import { useGetProfilePosts } from '@/lib/client-queries/profilePosts'
import { useGetFollowerCounts } from '@/lib/client-queries/followerCounts'
import { useGetAchievements } from '@/lib/client-queries/achievements'
import LoadingComponent from '@/components/LoadingComponent'
import PostCard from '@/components/PostCard'
import DetailedPostModal from '@/components/modal/DetailedPostModal'
import AchievementUnlockModal from '@/components/modal/AchievementUnlockModal'
import { supabase } from '@/lib/supabase'
import { AchievementRow } from '@/lib/achievements'
import { useGetUserProfileById } from '@/lib/client-queries/users'
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
  followed?: boolean
}

const ProfilePage: React.FC = () => {
  const router = useRouter()
  const { id } = useParams()
  const userIdParam = Array.isArray(id) ? id[0] : id

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileState | null>(null)
  const [loading, setLoading] = useState(true)
  const [postModalId, setPostModalId] = useState<string | null>(null)
  const [achievements, setAchievements] = useState<AchievementRow[]>([])
  const [unlockQueue, setUnlockQueue] = useState<AchievementRow[]>([])
  const [showAchievementsModal, setShowAchievementsModal] = useState(false)

  const { data: classcategories = [], isLoading: isGetClassCategoriesLoading } = useGetClassCategories()
  const { data: userprofile, isLoading: isGetUserProfileLoading } = useGetUserProfileById(userIdParam)
  const { data: postsData, isLoading: postsLoading } = useGetProfilePosts(userIdParam)
  const { data: followerCounts } = useGetFollowerCounts(userIdParam)
  const { data: achievementsData } = useGetAchievements(userIdParam)

  const badgeColors = ['#F5C518', '#C084FC', '#3B82F6', '#10B981', '#FB7185', '#F59E0B']
  const getBadgeColor = (index: number) => badgeColors[index % badgeColors.length]

  // Ambil user login
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
    }
    fetchUser()
  }, [router])

  // Sync profile
  useEffect(() => {
    if (userprofile) setProfile(userprofile)
  }, [userprofile])

  // Sync achievements
  useEffect(() => {
    if (achievementsData) {
      setAchievements(achievementsData.achievements)
      if (achievementsData.newlyUnlocked.length) {
        setUnlockQueue(prev => [...prev, ...achievementsData.newlyUnlocked])
      }
    }
  }, [achievementsData])

  useEffect(() => {
    if (user && profile && profile.id && user.id !== profile.id && profile.followed === undefined) {
      let cancelled = false;
      (async () => {
        try {
          const { data, error } = await supabase
            .from('userfollowers')
            .select('follower_id')
            .eq('follower_id', user.id)
            .eq('followed_id', profile.id)
            .maybeSingle();
          if (!cancelled) {
            setProfile(prev => prev ? { ...prev, followed: !!data } : prev)
          }
          if (error && (error as any).code && !['PGRST116','PGRST103'].includes((error as any).code)) {
            console.warn('Follow status check error:', error)
          }
        } catch (e) {
          if (!cancelled) console.warn('Follow status fetch failed', e)
        }
      })();
      return () => { cancelled = true }
    }
  }, [user, profile?.id, profile?.followed])

  useEffect(() => {
    if (!isGetUserProfileLoading && !postsLoading) setLoading(false)
  }, [isGetUserProfileLoading, postsLoading])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleFollowToggle = (newFollowed: boolean) => {
    setProfile(prev => prev ? { ...prev, followed: newFollowed } : prev)
  }

  if (loading) return <LoadingComponent message="Loading profile..." />
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Profile not found</div>
  if (isGetClassCategoriesLoading || isGetUserProfileLoading) return <LoadingComponent message="Loading..." />

  return (
    <div className=" flex flex-col lg:flex-row lg:h-screen overflow-x-hidden lg:ml-64">

      {/* Post Modal */}
      {postModalId && user && (
        <DetailedPostModal postId={postModalId} setPostModalId={setPostModalId} userId={user.id} />
      )}

      {/* Kolom kiri - Profile */}
      <div className="w-full min-h-[30vh] lg:min-h-[60vh] ml-0 lg:h-screen lg:w-80 border-b cursor-pointer lg:border-b-transparent lg:border-r border-[var(--medium-grey)] p-6 lg:overflow-y-auto scrollbar-hide">
        <div className="flex flex-col items-center text-center h-full w-full">

          {/* Avatar */}
          <div className="relative mb-4 w-24 h-24 rounded-full p-1">
            <Image
              src={profile.image_url || "/placeholder.svg?height=88&width=88&query=profile avatar"}
              alt="Profile"
              width={88}
              height={88}
              className="w-full h-full rounded-full object-cover bg-white"
            />
          </div>

          {/* Info */}
          <p className="text-sm text-[var(--dark-grey)] mb-1">{profile.role}</p>
          <h1 className="text-lg font-semibold text-[var(--black)] mb-3">{profile.username}</h1>
          {profile.biography && (
            <p className="text-sm mb-4 leading-relaxed text-justify max-w-[20em]">{profile.biography}</p>
          )}

          {/* Follow Button */}
          {user && profile.id !== user.id && (
            <FollowButton
              userId={user.id}
              followedUserId={profile.id || ''}
              followed={profile.followed ?? false}
              onChange={(f) => setProfile(prev => prev ? { ...prev, followed: f } : prev)}
              className="self-center w-full max-w-[20em] mb-6 py-2 px-4"
            />
          )}

          {/* Follower/Following */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="font-semibold">{followerCounts?.followerCount ?? 0}</p>
              <p className="text-sm text-[var(--dark-grey)]">Pengikut</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{followerCounts?.followingCount ?? 0}</p>
              <p className="text-sm text-[var(--dark-grey)]">Mengikuti</p>
            </div>
          </div>

          {/* Location & Phone */}
          {profile.location && (
            <div className="flex items-center gap-2 text-sm mb-2">
              <IoLocationOutline className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.phone_number && (
            <div className="flex items-center gap-2 text-sm mb-6">
              <IoLogoWhatsapp className="w-4 h-4 text-green-500" />
              <span>{profile.phone_number}</span>
            </div>
          )}

          {/* Logout */}
          {user && profile.id === user.id && (
            <button
              onClick={handleLogout}
              className="flex items-center p-3 w-full max-w-[20em] bg-gray-100 justify-center rounded-lg mb-4"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-2 font-medium">Logout</span>
            </button>
          )}

          {/* Achievements */}
          <div className="w-full max-w-[20em] mt-2 pt-4 border-t border-[var(--medium-grey)] text-left">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => achievements.length && setShowAchievementsModal(true)}
                className="text-base font-semibold flex items-center gap-1 text-[var(--black)]"
              >
                Pencapaian
              </button>
              {achievements.length > 6 && (
                <button
                  type="button"
                  onClick={() => setShowAchievementsModal(true)}
                  className="text-xs text-[var(--dark-grey)] hover:underline"
                >
                  Lihat semua
                </button>
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
                          <span className="text-[9px] px-1 leading-tight text-center font-medium" style={{ color }}>
                            {a.name.split(' ').slice(0,2).join(' ')}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div> {/* Tutup flex-col items-center text-center */}
      </div> {/* Tutup kolom kiri */}

      {/* Kolom kanan - Post */}
      <div className="flex-1 min-h-screen cursor-pointer p-6 lg:overflow-y-auto h-screen">
        {postsData && postsData.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(17em,1fr))] p-3 gap-2 lg:gap-4">
            {postsData.map(post => (
              <PostCard key={post.id} post={post} onClick={() => setPostModalId(post.id)} hideActions={"hidden"} userId={profile.id || ""} />
            ))}
          </div>
        ) : (
          <div className="flex h-96 flex-col items-center justify-center text-center">
            <Image src="/profile-empty.png" alt="Empty state illustration" width={300} height={150} className="opacity-60 mb-6"/>
            <h3 className="text-lg font-medium text-[var(--dark-grey)] mb-2">Belum Ada postingan</h3>
          </div>
        )}
      </div>

      {/* Achievement Modal */}
      {showAchievementsModal && (
        <AchievementUnlockModal
          queue={achievements.map(a => ({ id: a.id, name: a.name, description: a.description, badge_icon: a.badge_icon }))}
          onClose={() => setShowAchievementsModal(false)}
        />
      )}

    </div> /* Tutup flex min-h-screen */
  )
}

export default ProfilePage