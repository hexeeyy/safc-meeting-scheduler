import React from 'react'
import Image from 'next/image'
import { safcLogoG } from '@/assets'

export default function Logo() {
  return (
    <div> 
    <Image 
        alt="South Asialink Finance Corporation Logo"
        src={safcLogoG}
        width={60} 
        height={60}
        className="h-20 w-20 object-contain"
        priority
        />
    </div>
  )
}



    