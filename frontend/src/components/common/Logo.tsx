import React from 'react'
import Image from 'next/image'
import { safcLogoG } from '@/assets'

export default function Logo() {
  return (
    <div className='flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200'> 
    <Image  
        alt="South Asialink Finance Corporation Logo"
        src={safcLogoG}
        width={120} 
        height={80}
        className="h-20 w-20 object-contain"
        priority
        />
        <span
        > Meeting Scheduler
        </span>
    </div>
  )
}



    