import React from 'react'

export const HeroSection = () => {
    return (
        <div className='w-full pt-4'>
            <div className='grid grid-cols-3 place-content-start place-items-start'>
                <div className='col-span-2 border rounded-t-xl bg-gradient-to-tr from-[#1F60F2] w-[98%] to-[#6392f8b2] text-white  flex flex-col justify-start items-start px-4 py-6 h-[52vh]'>
                    <div className='text-left text-2xl'>
                        Recent User Transactions in <span className='font-bold tracking-wide'>MetaWallet</span>
                    </div>
                    <div>
                    </div>
                </div>
                <div className='col-span-1 border rounded-t-xl bg-gradient-to-tr from-[#ff7903c0] to-[#FF7902] w-full h-[52vh]'>
                    Some thing
                </div>
            </div>
        </div>
    )
}
