'use client'
import React from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "../components/Button";


export default function SignUp() {
    const router = useRouter();

    const goBack = () => {
        router.push('/'); 
    };

  return (
    <div className='container'>
      <div>SignUp Page</div>
      <Button onClick={goBack} text={"Go back home"}/>
    </div>
  )
}
