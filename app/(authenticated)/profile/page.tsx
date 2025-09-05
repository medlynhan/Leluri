'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const ProfilePage: React.FC = () => {
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      router.push(`/profile/${user.id}`)
    }
    load()
  }, [router])

  return null
}

export default ProfilePage