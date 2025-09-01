'use client'
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Button from "../../components/Button";
import { supabaseClient } from '../../lib/supabaseClient';
import { IoMdClose } from "react-icons/io";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const goBack = () => {
        router.push('/'); 
    };

    const handleLogin = async () => {
        if (email === "" || password === "") {
            setError('Mohon lengkapi data anda');
            return;
        }
        setError('');

        const { error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setError(error.message);
            console.log("3")
            return;
        }

        router.push('/beranda');
    };

  return (
    <div className='container  h-[100vh] flex justify-center items-center'>
      <IoMdClose className='text-3xl absolute top-5 right-5 cursor-pointer' onClick={goBack}/>
      <div className='grid gap-4 lg:min-h-[30vh]  lg:min-w-[30vw] p-6'>
        <div className='flex justify-center items-center flex-col gap-4'>
            <div className='text-xl lg:text-2xl font-semibold'>Masuk Akun</div>
            <p className='font-semibold'>Belum punya akun? <span className='underline underline-offset-1 cursor-pointer' onClick={() => router.push('/signup')}>Daftar</span></p>
        </div>
        <div className=''>
            <label className='font-semibold'>Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='bg-[var(--light-grey)] p-2 w-full rounded-3xl'
            />
        </div>
        <div>
            <label className='font-semibold'>Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='bg-[var(--light-grey)] p-2 w-full rounded-3xl'
            />
        </div>
        {error && <p className="text-[var(--red)] w-full text-center">{error}</p>}
        <Button onClick={handleLogin} text={"Masuk"} additional_styles={"bg-[var(--black)]  hover:bg-transparent text-[var(--white)] hover:text-[var(--black)]"}/>
        
      </div>
    </div>
  )
}
