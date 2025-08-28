'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "./components/Button";
import { PiStudent } from "react-icons/pi";
import { GiStoneCrafting } from "react-icons/gi";
import CommunityMemberCard from "./components/CommunityMemberCard";
import LandingPageSection from "./components/LandingPageSection";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa"; 


export default function Home() {

  const router  = useRouter();

  const goToLoginPage = () => {
    router.push('/Login'); 
  };

  const goToSignUpPage = () => {
    router.push('/SignUp'); 
  };

  return (
    
    <div className="container md:p-15 md:gap-30 relative">
      {/*logo*/}
      <Image src="/logo-leluri.png" alt="Leluri Logo" width={70} height={70} className="absolute top-5 left-5 fixed "/>
      
      
      {/*landing section*/}
      <div className="grid grid-rows-1 md:grid-rows-1 md:grid-cols-2 gap-4  w-full portrait:min-h-[50vh] landscape:min-h-[70vh] ">
        <div className="flex flex-col  gap-6 text-left justify-center p-5 md:p-10 ">
          <h1 className="text-2xl md:text-3xl 2xl:text-4xl font-semibold w-full">Komunitas Budaya Untuk Generasi Kreatif!</h1>
          <p className="w-full text-sm md:text-md 2xl:text-base text-justify">Daftar atau login sekarang untuk mulai berkarya, bergabung, dan dukung budaya Indonesia!</p>
          
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
          <h1 className="text-xl md:text-2xl 2xl:text-3xl font-semibold w-full">Bersama Kita Menjaga Warisan Budaya</h1>
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


      {/*apa yang bisa dilakuin di web nya*/}
      <div className="flex flex-col gap-6 md:gap-20 py-10 ">
        
        <LandingPageSection order1={"order-2 md:order-1"} order2={"order-1 md:order-2"} title={"Explorasi Budaya Indonesia"} description={"Temukan beragam budaya Indonesia dalam format yang seru dan interaktif. Jelajahi seni, kerajinan, dan tradisi yang belum pernah kamu lihat sebelumnya !"} image={"explorasi-budaya"}/>
        <LandingPageSection order1={"order-2"} order2={"order-1"} title={"Belajar Langsung dari Pengrajin Asli"} description={"Ikut kelas budaya yang diadakan oleh pengrajin-pengrajin asli Indonesia. Dari menari bali hingga bermain wayang, semua bisa kamu pelajari !"} image={"belajar-dari-pengrajin"}/>
        <LandingPageSection order1={"md:order-1"} order2={"order-1 md:order-2"} title={"Beli, Jual, dan Dukung Kreativitas"} description={"Beli atau jual kerajinan asli Indonesia dengan mudah. Bergabung dengan komunitas kreatif kami !"} image={"beli-jual"}/>
        <LandingPageSection order1={"order-2 order-2"} order2={"order-1"} title={"Kumpulkan Badge, Tunjukkan Kontribusimu!"} description={"Semakin aktif, semakin banyak badge yang bisa kamu raih. Tunjukkan dedikasimu dan jadilah bagian dari perjalanan seru ini!"} image={"kumpulkan-badge"}/>
      </div>


    {/*ajakan terakhir*/}
      <div className="flex flex-col  gap-10 justify-center p-5 md:p-10 w-full">
          <h1 className="text-xl md:text-2xl 2xl:text-4xl font-semibold w-full text-center w-full">Tunggu Apa Lagi ? Yuk Bergabung Sekarang Juga !</h1>
          <div className="flex justify-center w-full">
            <Button onClick={goToLoginPage} text={"Bergabung ke Komunitas"} additional_styles="bg-[var(--yellow)] md:px-8 border-transparent text-[var(--white)] hover:bg-[var(--white)] hover:text-[var(--yellow)] hover:border-[var(--yellow)]"/>
          </div>
      </div>



    {/*footer */}
      <div className="flex flex-col text-left gap-10 justify-start p-5 md:p-10 w-full ">
          <div className="flex flex-col gap-10 justify-start p-5 md:p-10 w-full  text-[var(--black)]">
              
              <div className="flex flex-row w-full gap-10 justify-start items-center">
                <Image
                  src="/logo-leluri.png"
                  alt="Leluri Logo"
                  width={150}
                  height={150}
                  priority
                  className="w-[5em] md:w-[10em]"
                />

                <div className="flex gap-6 text-2xl w-full">
                  <FaInstagram className="text-[var(--pink)]" />
                  <FaTwitter className="text-[var(--light-blue)]" />
                  <FaFacebook className="text-[var(--dark-blue)]" />
                </div>
              </div>

            
              <div className="flex flex-col border-t border-[var(--dark-grey)] pt-5 text-sm">
                <div className="flex flex-col md:flex-row justify-between gap-4 text-[var(--black)]">
                  <a href="#">About</a>
                  <a href="#">Terms</a>
                  <a href="#">Privacy</a>
                  <a href="#">License</a>
                  <a href="#">Company Information</a>
                </div>
              </div>
          </div>
      </div>


    </div>
  );
}
