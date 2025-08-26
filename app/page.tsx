'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "./components/Button";

export default function Home() {

  const router  = useRouter();

  const goToLoginPage = () => {
    router.push('/Login'); 
  };


  const goToSignUpPage = () => {
    router.push('/SignUp'); 
  };

  return (
    
    <div className="container">
      <h1>Hello</h1>
      <Button onClick={goToSignUpPage} text={"Go to signup page"} additional_styles=""/>
      <Button onClick={goToLoginPage} text={"Go to login page"} additional_styles=""/>
    </div>
  );
}
