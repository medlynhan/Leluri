'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Home, Compass, BookOpen, ShoppingBag } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'
import { RxHamburgerMenu } from "react-icons/rx";
import { X } from "lucide-react"

interface Profile {
  username: string
  image_url: string
}

const Sidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isOpen, setIsOpen] = useState(false)

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

  if(!isOpen) return (
    <div className="hidden md:block w-16 lg:w-20 shrink-0 relative">
      <button
        aria-label="Open menu"
        className="left-5 top-5 flex z-75 fixed justify-center items-center w-12 h-12 rounded-lg bg-[var(--white)] hover:bg-[var(--light-grey)] hover:text-[var(--yellow)] border shadow-md transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <RxHamburgerMenu className='w-5 h-5'/>
      </button>
    </div>
  )

  return (
    <div className="absolute lg:sticky z-100 flex flex-col w-1/4 max-w-84 min-w-48 top-0 bg-white h-screen p-4 border-r">
      <div className="mb-10 w-full flex flex-row justify-between items-center">
        <Image src="/logo-leluri.png" alt="Leluri Logo" width={70} height={70} className=""/>
        <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-[var(--medium-grey)] rounded-full transition-colors flex">
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`flex items-center p-3 my-2 rounded-lg transition-colors ${pathname === item.href ? 'bg-gray-100 text-orange-600' : 'hover:bg-gray-100'}`}>
                <item.icon className="w-5 h-5" />
                <span className="ml-4 font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <div className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer" onClick={() => router.push('/profile')}>
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
    </div>
  )
}

export default Sidebar