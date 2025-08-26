'use client'
import React, { useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import { supabase } from '../lib/supabase';


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

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setError(error.message);
            return;
        }

        router.push('/');
    };

  return (
    <div className='container flex justify-center items-center'>
      <div className='grid gap-4 lg:min-h-[80vh] lg:max-h-[90vh] lg:min-w-[30vw] p-6'>
        <div className='flex justify-center items-center flex-col gap-4'>
            <div className='text-xl font-semibold'>Masuk Akun</div>
            <p className='font-semibold'>Belum punya akun? <span className='underline underline-offset-1' onClick={() => router.push('/SignUp')}>Daftar</span></p>
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
        <Button onClick={goBack} text={"Go back home"} additional_styles=""/>
      </div>
    </div>
  )
}
