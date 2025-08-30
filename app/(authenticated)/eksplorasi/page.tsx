'use client'
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import { Star, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

const EksplorasiPage = () => {
  return (
        <div className='relative flex min-h-screen bg-[var(--white)] overflow-x-hidden '>
            <div className=" w-full h-full ">
                
                {/*Navbar*/}
                <div className='flex gap-4 justify-center bg-[var(--white)] w-full z-20 fixed  max-w-screen p-2'>
                    {/*Sidebar */}
                    <Sidebar />

                    {/*Search Bar */}
                    <div className="flex  justify-center items-center ml-10 lg:ml-64 flex relative flex-1 ">
                        <input
                            type="text"
                            placeholder="Apa yang ingin kamu temukan?"
                            className="w-full py-3 pl-12 pr-4 border border-[var(--black)] rounded-full  h-[80%] border"
                            value={""}

                        />
                        <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--dark-grey)]" />
                    </div>

                    {/*Icon */}
                    <div className="w-30  lg:col-span-1  flex items-center justify-end  gap-6 mr-3">
                        <button className="bg-[var(--yellow)] text-white  h-[80%] rounded-full flex-1 font-semibold hover:bg-transparent hover:border-[var(--yellow)] border border-transparent font-semibold hover:text-[var(--black)]  transition-colors">Cari</button>
                    </div>
                    
                </div>
            </div>


            <div className='ml-3 mr-3 lg:ml-68 grid grid-cols-[repeat(auto-fill,minmax(15em,1fr))] p-3 gap-3 lg:gap-6 mt-20'>
              <p>Here is Exploration Content</p>
            </div>
          </div>
  );
};

export default EksplorasiPage;
