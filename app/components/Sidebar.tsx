'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Home, Compass, BookOpen, ShoppingBag, LogOut, Hamburger } from 'lucide-react'
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
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profileData } = await supabaseClient.from('users').select('username, image_url').eq('id', user.id).single()
        setProfile(profileData)
      } else {
        router.push('/Login')
      }
    }
    fetchUser()
  }, [router])

  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
    router.push('/Login')
  }

  const navItems = [
    { href: '/beranda', icon: Home, label: 'Beranda' },
    { href: '/eksplorasi', icon: Compass, label: 'Eksplorasi' },
    { href: '/kelas', icon: BookOpen, label: 'Kelas' },
    { href: '/toko', icon: ShoppingBag, label: 'Toko' },
  ]




  return (
    <div className='w-fit h-fit'>
      
      {/*Sidebar Desktop */}
      <div className={`top-0 absolute left-0  lg:flex lg:flex ${isOpen ? "flex" : "hidden"}  w-64 z-20 flex-none bg-[var(--white)] h-screen p-4 fixed flex-col shadow-[2px_0_2px_rgba(0,0,0,0.1)] lg:shadow-none lg:border-r border-[var(--medium-grey)] z-10`}>
        <div className="mb-10 w-full flex justify-between items-center">
          {/*logo*/}
          <Image src="/logo-leluri.png" alt="Leluri Logo" width={70} height={70} className=""/>
          <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-[var(--medium-grey)] rounded-full transition-colors lg:hidden flex ">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-grow">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={`flex items-center p-3 my-2 rounded-lg transition-colors ${pathname === item.href ? 'bg-[var(--light-grey)] text-[var(--yellow)]' : 'hover:bg-[var(--light-grey)]'}`}>
                  <item.icon className="w-5 h-5" />
                  <span className="ml-4 font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
          <div className="p-3 hover:bg-[var(--light-grey)] rounded-lg cursor-pointer" onClick={() => router.push('/profile')}>
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
          
      {/*Sidebar Mobile */}
      <div className={`lg:hidden flex z-10 fixed h-10 flex justify-center items-center w-10   rounded-lg bg-[var(--white)] hover:bg-[var(--light-grey)] hover:text-[var(--yellow)]`}  onClick={() => setIsOpen(!isOpen)} >
            <RxHamburgerMenu className='w-5 h-5'/>
      </div>

    <div className="sticky flex flex-col w-1/4 max-w-84 min-w-48 top-0 bg-white h-screen p-4 border-r">
      <Image src="/logo-leluri.png" alt="Leluri Logo" width={70} height={70}/>
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
