'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Home, Compass, BookOpen, ShoppingBag } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'
import { RxHamburgerMenu } from 'react-icons/rx'
import { X } from 'lucide-react'

interface Profile {
  username: string
  image_url: string
}

const Sidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profileData } = await supabase.from('users').select('username, image_url').eq('id', user.id).single()
        setProfile(profileData)
      } else {
        router.push('/Login')
      }
    }
    fetchUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/Login')
  }

  const navItems = [
    { href: '/beranda', icon: Home, label: 'Beranda' },
    { href: '/eksplorasi', icon: Compass, label: 'Eksplorasi' },
    { href: '/kelas', icon: BookOpen, label: 'Kelas' },
    { href: '/toko', icon: ShoppingBag, label: 'Toko' },
  ]

  const NavContent = () => (
    <>
      <div className="mb-10 w-full flex flex-row justify-between items-center">
        <Image src="/logo-leluri.png" alt="Leluri Logo" width={70} height={70} />
        <button onClick={() => setMobileOpen(false)} className="p-1 md:hidden hover:bg-[var(--medium-grey)] rounded-full transition-colors flex" aria-label="Tutup">
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map(item => (
            <li key={item.href}>
              <Link href={item.href} className={`flex items-center p-3 my-2 rounded-lg transition-colors ${pathname === item.href ? 'bg-gray-100 text-orange-600' : 'hover:bg-gray-100'}`} onClick={() => setMobileOpen(false)}>
                <item.icon className="w-5 h-5" />
                <span className="ml-4 font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <div className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer" onClick={() => { setMobileOpen(false); router.push('/profile') }}>
          <div className="flex items-center">
            {profile?.image_url ? (
              <Image src={profile.image_url} alt={profile.username} width={40} height={40} className="rounded-full" />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            )}
            <div className="ml-3">
              <p className="font-semibold text-sm">{profile?.username || 'Loading...'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <button
        aria-label="Buka menu"
        className="fixed md:hidden left-4 top-4 z-40 flex justify-center items-center w-11 h-11 rounded-lg bg-white hover:bg-[var(--light-grey)] border shadow-md"
        onClick={() => setMobileOpen(true)}
      >
        <RxHamburgerMenu className='w-5 h-5' />
      </button>
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileOpen(false)} />}
      {mobileOpen && (
        <div className="fixed md:hidden top-0 left-0 z-40 w-72 max-w-[80%] h-full bg-white p-4 border-r flex flex-col">
          <NavContent />
        </div>
      )}
      <div className="hidden md:flex md:sticky top-0 z-20 flex-col w-64 xl:w-72 h-screen bg-white p-4 border-r">
        <NavContent />
      </div>
    </>
  )
}

export default Sidebar