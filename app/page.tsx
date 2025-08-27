'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "./components/Button";

export default function Home() {

  const router  = useRouter();

  const goToLoginPage = () => {
    router.push('/Login'); 
  };

  return (
    
    <div className="container">
      <h1>Welcome to Leluri</h1>
      <p>This is the landing page.</p>
      <Button onClick={goToLoginPage} text={"Login"} additional_styles=""/>
    </div>
  );
}
