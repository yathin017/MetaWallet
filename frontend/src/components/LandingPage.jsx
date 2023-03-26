import React from 'react'
import { HeroSection } from './LandingPage/HeroSection'
import { Sec1 } from './LandingPage/Sec1'
import { Sec2 } from './LandingPage/Sec2'
import { Sec3 } from './LandingPage/Sec3'
export const LandingPage = () => {
    return (
        <div className='flex flex-col justify-center items-center px-10 py-14 space-y-12 w-full'>
            <Sec1 />
            <HeroSection />
            <Sec2 />
            <Sec3 />
        </div>
    )
}
