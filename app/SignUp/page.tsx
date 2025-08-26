'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../components/Button';
import { supabase } from '../lib/supabase'; 
import { IoMdClose } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";

// Tipe data untuk menangani state
interface SignUpState {
    email: string;
    password: string;   
    username: string;
    role: string;
    location: string;
    error: string;
}

const SignUp: React.FC = () => {
    const [state, setState] = useState<SignUpState>({
        email: '',
        password: '',
        username: '',
        role: '',
        location: '',
        error: '',
    });



    const router = useRouter();

    const handleSignUp = async () => {
      
      if (state.email === "" || state.password === "" || state.username === "" || state.role === "" || state.location === "") {
          setState({ ...state, error: 'Mohon lengkapi data anda' });
          return;
      }

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

      // Jika user berhasil sign-up, kita simpan data ke tabel 'users'
      const user = data?.user;

      if (user) {
          const { error: dbError } = await supabase
              .from('users')
              .insert([{
                  id: user.id,
                  email: state.email,
                  username: state.username,
                  role: state.role,
                  location: state.location,
              }]);

          if (dbError) {
              setState({ ...state, error: dbError.message });
              return;
          }
          router.push('/Login');

      } else {
          setState({ ...state, error: 'User not found after sign up' });
      }
  };



    const [isRoleOpen, setIsRoleOpen] = useState(false); 
    const [selectedRole, setSelectedRole] = useState(''); 

    const openRoleDDl = () => {
        setIsRoleOpen(!isRoleOpen);
    }

    const handleRoleSelect = (role: string) => {
        setSelectedRole(role); 
        setState({ ...state, role }); 
        setIsRoleOpen(false); 
    };

    const goBack = () => {
        router.push('/');
    };

    const goToLoginPage = () => {
        router.push('/Login');
    };


    return (
        <div className='container flex justify-center items-center relative'>
            <IoMdClose className='text-3xl absolute top-5 right-5 cursor-pointer' onClick={goBack}/>
            <div className=' grid gap-4 lg:min-h-[80vh] lg:max-h-[90vh] lg:min-w-[30vw] p-6 '>
                <div className='flex justify-center items-center flex-col gap-4 '>
                    <div  className='text-xl font-semibold '>Daftar Akun</div>
                    <p className='font-semibold'>Sudah punya akun ? <span className='underline underline-offset-1 cursor-pointer' onClick={goToLoginPage}>Masuk</span></p>
                </div>
                {/* Input Username */}
                <div>
                    <label className='font-semibold'>Username</label>
                    <input
                        type="text"
                        value={state.username}
                        onChange={(e) => setState({ ...state, username: e.target.value })}
                        required
                        className='bg-[var(--light-grey)] p-2 w-full rounded-3xl'
                    />
                </div>

                {/* Input Role */}
                <div className='relative'>
                    <label className='font-semibold'>Role</label>
                    <div onClick={openRoleDDl} className='bg-[var(--light-grey)] p-2 w-full rounded-3xl cursor-pointer flex justify-between items-center'>
                        <p>{selectedRole || "Pilih Role"}</p>
                        <RiArrowDropDownLine className='text-2xl'/>
                    </div>

                    {isRoleOpen && (
                      <div className='absolute top-10 bg-white w-full border rounded-lg shadow-md'>
                            <div onClick={() => handleRoleSelect('Pelajar Budaya')} className='p-2 cursor-pointer hover:bg-gray-200'>
                                Pelajar Budaya
                            </div>
                            <div onClick={() => handleRoleSelect('Pengrajin')} className='p-2 cursor-pointer hover:bg-gray-200'>
                                Pengrajin
                            </div>
                            <div onClick={() => handleRoleSelect('Sanggar Seni')} className='p-2 cursor-pointer hover:bg-gray-200'>
                                Sanggar Seni
                            </div>
                            <div onClick={() => handleRoleSelect('Sanggar Seni')} className='p-2 cursor-pointer hover:bg-gray-200'>
                                Kolektor
                            </div>
                        </div>
                      )}
                </div>
                
                {/* Input Email */}
                <div className=''>
                    <label className='font-semibold'>Email</label>
                    <input
                        type="email"
                        value={state.email}
                        onChange={(e) => setState({ ...state, email: e.target.value })}
                        required

                        className='bg-[var(--light-grey)] p-2 w-full rounded-3xl'
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
                        className='bg-[var(--light-grey)] p-2 w-full rounded-3xl'
                    />
                </div>
                <div>
                    <label className='font-semibold'>Location</label>
                    <input
                        type="text"
                        value={state.location}
                        onChange={(e) => setState({ ...state, location: e.target.value })}
                        required
                        className='bg-[var(--light-grey)] p-2 w-full rounded-3xl'
                    />
                </div>

                  {/* Error Message */}
                  {state.error && <p className="text-[var(--red)] w-full text-center">{state.error}</p>}

                  <Button onClick={handleSignUp} text={"Daftar"} additional_styles={"bg-[var(--black)]  hover:bg-transparent text-[var(--white)] hover:text-[var(--black)]"}/>
                  
        
            </div>
        </div>   
    );
};

export default SignUp;
