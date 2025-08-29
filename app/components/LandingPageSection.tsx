'use client'
import Image from "next/image";
import { useState } from "react";
import Button from "./Button";

interface Props {
    title : string;
    description : string;
    image : string;
    order1 :string;
    order2 :string;

}

export default function LandingPageSection({title,  description, image, order1, order2}: Props) {
  return (
        <div className="grid md:grid-rows-1 md:grid-cols-2 gap-4 justify-center items-center w-full h-fit border rounded-2xl">
          
          <div className={`w-full min-h-[30vh] md:min-h-[50vh]  flex flex-col  gap-6 text-left justify-center px-5 md:px-10  ${order1}`}>
            <h1 className="text-xl md:text-2xl 2xl:text-4xl font-semibold w-full">{title}</h1>
            <p className="w-full text-sm md:text-md 2xl:text-base text-justify">{description}</p>
          </div>

          <div className={`flex min-h-[30vh] md:min-h-[50vh] w-full justify-center  items-center ${order2}`}>
            <Image src={`/${image}.png`} alt="Explorasi Budaya" width={400} height={400} className="  h-auto w-full md:w-[30em] p-10  w-auto opacity-100"/>
          </div>

        </div>
  )
}