'use client'
import React from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "../components/Button";


export default function Login() {
    const router = useRouter();

    const goBack = () => {
        router.push('/'); 
    };

  return (
    <div className='container'>
      <div>Login Page</div>
      <Button onClick={goBack} text={"Go back home"} additional_styles=""/>
    </div>
  )
}
