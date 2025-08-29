'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Home, Compass, BookOpen, ShoppingBag, LogOut, Hamburger } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";

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




  return (
    <div className='w-fit h-fit'>
      
      {/*Sidebar Desktop */}
      <div className={`lg:flex lg:flex ${isOpen ? "flex" : "hidden"}  w-64 z-20 flex-none bg-[var(--white)] h-screen p-4 fixed flex-col shadow-[4px_0_10px_rgba(0,0,0,0.1)] lg:border-r border-[var(--medium-grey)] z-10`}>
        <div className="mb-10 w-full flex justify-between items-center">
          {/*logo*/}
          <Image src="/logo-leluri.png" alt="Leluri Logo" width={70} height={70} className=""/>
          <IoMdClose className='flex lg:hidden text-2xl  text-[var(--dark-grey)] absolute top-5 right-5 cursor-pointer' onClick={() => setIsOpen(!isOpen)}/>

        </div>
        <nav className="flex-grow">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={`flex items-center p-3 my-2 rounded-lg transition-colors ${pathname === item.href ? 'bg-gray-100 text-[var(--yellow)]' : 'hover:bg-gray-100'}`}>
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
          
      {/*Sidebar Mobile */}
      <div className="lg:hidden flex z-10 fixed h-fit w-fit  p-3 bg-[var(--white)]  rounded-lg  hover:bg-gray-100 hover:text-[var(--yellow)]"  onClick={() => setIsOpen(!isOpen)} >
            <RxHamburgerMenu className='w-5 h-5'/>
      </div>

    </div>
  )
}

export default Sidebar
