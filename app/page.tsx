'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "./components/Button";
import { PiStudent } from "react-icons/pi";
import { GiStoneCrafting } from "react-icons/gi";
import CommunityMemberCard from "./components/CommunityMemberCard";


export default function Home() {

  const router  = useRouter();

  const goToLoginPage = () => {
    router.push('/Login'); 
  };

  const goToSignUpPage = () => {
    router.push('/SignUp'); 
  };

  return (
    
    <div className="container md:p-10 md:gap-30 relative">
      {/*logo*/}
      <Image src="/logo-leluri.png" alt="Leluri Logo" width={70} height={70} className="absolute top-5 left-5 fixed border"/>
      
      
      {/*landing section*/}
      <div className="grid grid-rows-1 md:grid-rows-1 md:grid-cols-2 gap-4  w-full portrait:min-h-[50vh] landscape:min-h-[70vh] ">
        <div className="flex flex-col  gap-6 text-left justify-center p-5 md:p-10 ">
          <h1 className="text-2xl md:text-3xl font-semibold w-full">Komunitas Budaya Untuk Generasi Kreatif!</h1>
          <p className="w-full text-sm md:text-md text-justify">Daftar atau login sekarang untuk mulai berkarya, bergabung, dan dukung budaya Indonesia!</p>
          
          <div className="flex gap-4 w-full">
              <Button onClick={goToLoginPage} text={"Masuk"} additional_styles="bg-[var(--yellow)] md:px-8 border-transparent text-[var(--white)] hover:bg-[var(--white)] hover:text-[var(--yellow)] hover:border-[var(--yellow)]"/>
              <Button onClick={goToSignUpPage} text={"Daftar"} additional_styles="md:px-8 hover:bg-[var(--black)] hover:text-[var(--white)]"/>
          </div>

        </div>
        <div className="w-full hidden md:flex justify-center items-center ">
          <Image src="/komunitas-budaya.png" alt="Komunitas Budaya" width={500} height={500} className="w-[70%] h-auto "/>
        </div>
        
      </div>

      {/*siapa aja membernya*/}
      <div className="flex gap-10 flex-col w-full  p-5 md:p-10">
          <h1 className="text-xl md:text-2xl font-semibold w-full">Bersama Kita Menjaga Warisan Budaya</h1>
          <div className="w-full overflow-hidden py-3">
              <div className="flex gap-6 justify-center items-center w-fit overflow-y-hidden animate-marquee">
                  <CommunityMemberCard 
                    username="aisyahnur_" 
                    role="pelajar budaya" 
                    imageSrc="/profile-example/aisyahnur_.png" 
                  />
                  <CommunityMemberCard 
                    username="anyaman_indo" 
                    role="pengrajin" 
                    imageSrc="/profile-example/anyaman_indonesia.png" 
                  />
                  <CommunityMemberCard 
                    username="fadlizon_" 
                    role="kolektor" 
                    imageSrc="/profile-example/fadlizon_.png" 
                  />
                  <CommunityMemberCard 
                    username="sanggartaribali" 
                    role="sanggar seni" 
                    imageSrc="/profile-example/sanggartaribali_.png" 
                  />
                  <CommunityMemberCard 
                    username="juliana_batik" 
                    role="pengrajin" 
                    imageSrc="/profile-example/juliana_batik.png" 
                  />
                  <CommunityMemberCard 
                    username="kerajinanharumi" 
                    role="pengrajin" 
                    imageSrc="/profile-example/kerajinanharumi_.png" 
                  />
                  <CommunityMemberCard 
                    username="bimapramata" 
                    role="pelajar budaya" 
                    imageSrc="/profile-example/bimapramata.png" 
                  />              
                  <CommunityMemberCard 
                    username="kusuma_arum" 
                    role="sanggar seni" 
                    imageSrc="/profile-example/kusuma_arum.png" 
                  />  
                  <CommunityMemberCard 
                    username="aisyahnur_" 
                    role="pelajar budaya" 
                    imageSrc="/profile-example/aisyahnur_.png" 
                  />
                  <CommunityMemberCard 
                    username="anyaman_indo" 
                    role="pengrajin" 
                    imageSrc="/profile-example/anyaman_indonesia.png" 
                  />
                  <CommunityMemberCard 
                    username="fadlizon_" 
                    role="kolektor" 
                    imageSrc="/profile-example/fadlizon_.png" 
                  />
                  <CommunityMemberCard 
                    username="sanggartaribali" 
                    role="sanggar seni" 
                    imageSrc="/profile-example/sanggartaribali_.png" 
                  />
                  <CommunityMemberCard 
                    username="juliana_batik" 
                    role="pengrajin" 
                    imageSrc="/profile-example/juliana_batik.png" 
                  />
                  <CommunityMemberCard 
                    username="kerajinanharumi" 
                    role="pengrajin" 
                    imageSrc="/profile-example/kerajinanharumi_.png" 
                  />
                  <CommunityMemberCard 
                    username="bimapramata" 
                    role="pelajar budaya" 
                    imageSrc="/profile-example/bimapramata.png" 
                  />              
                  <CommunityMemberCard 
                    username="kusuma_arum" 
                    role="sanggar seni" 
                    imageSrc="/profile-example/kusuma_arum.png" 
                  />  
              </div>
          </div>
          
      </div>

      
    </div>
  );
}
