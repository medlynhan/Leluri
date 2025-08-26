'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../components/Button';
import { supabase } from '../lib/supabase'; 

// Tipe data untuk menangani state
interface SignUpState {
    email: string;
    password: string;
    error: string;
}

const SignUp: React.FC = () => {
    const [state, setState] = useState<SignUpState>({
        email: '',
        password: '',
        error: '',
    });

    const router = useRouter();

    const handleSignUp = async () => {
        setState({ ...state, error: '' });

        // Sign up with email and password using Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: state.email,
            password: state.password,
        });

        if (error) {
            setState({ ...state, error: error.message });
            return;
        }

        // Jika user berhasil sign-up, kita simpan data ke tabel 'user' (hanya email dan id)
        const user = data?.user;

        if (user) {
            const { error: dbError } = await supabase
                .from('user')  
                .insert([{ id: user.id, email: state.email, password:state.password}]);

            if (dbError) {
                setState({ ...state, error: dbError.message });
                return;
            }


        } else {
            setState({ ...state, error: 'User not found after sign up' });
        }
    };

    const goBack = () => {
        router.push('/');
    };

    return (
        <div className='container flex justify-center items-center '>
            <div className='border grid gap-6 landscape:h-[80vh] p-6 '>
                <div  className='text-xl font-semibold'>SignUp Page</div>
                <p className='font-semibold'>Sudah punya akun ? <span className='underline underline-offset-1'>Masuk</span></p>
                  {/* Input Email */}
                  <div className=''>
                      <label className='font-semibold'>Email</label>
                      <input
                          type="email"
                          value={state.email}
                          onChange={(e) => setState({ ...state, email: e.target.value })}
                          required

                          className='bg-white p-2 w-full rounded-3xl'
                      />
                  </div>
                  
                  {/* Input Password */}
                  <div>
                      <label className='font-semibold'>Password</label>
                      <input
                          type="password"
                          value={state.password}
                          onChange={(e) => setState({ ...state, password: e.target.value })}
                          required
                          className='bg-white p-2 w-full rounded-3xl'
                      />
                  </div>

                  {/* Error Message */}
                  {state.error && <p style={{ color: 'red' }}>{state.error}</p>}

                  
                  <Button onClick={handleSignUp} text={"Sign Up"} additional_styles={"hover:bg-[var(--black)] hover:text-[var(--white)]"}/>
                  <Button onClick={goBack} text={"Go back home"} additional_styles={"hover:bg-[var(--black)] hover:text-[var(--white)]"}/>
        
            </div>
        </div>   
    );
};

export default SignUp;
