import React from 'react'
import { Sec1 } from '../Dashboard/Sec1'
import { Sec2 } from '../Dashboard/Sec2'

export const DashboardLanding = () => {
  return (
    <div className='flex flex-col justify-start items-start px-10 py-14 space-y-12 w-full' id='dashboard'>
        <Sec1/>        
        <Sec2/>
    </div>
  )
}
