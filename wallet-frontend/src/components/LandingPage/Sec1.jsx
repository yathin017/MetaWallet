import React from 'react'
import {HiOutlineArrowRight} from 'react-icons/hi'
import { Button } from 'flowbite-react'
export const Sec1 = () => {
    return (
        <div className='grid grid-cols-2 place-content-center place-items-center gap-x-4'>
            <div className=''>
                <div className='text-6xl'>
                On MetaWallet, trade cryptocurrencies in security.
                </div>
            </div>
            <div className='flex flex-col justify-start items-start space-y-4'>
                <div className='text-lg'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio dolorum, quaerat error tempora rem non est, repudiandae tempore minima vitae quibusdam ipsam odio ab voluptates accusantium earum ex dicta quae totam aspernatur adipisci minus omnis, fugiat eaque! Delectus, maxime in!
                </div>
                <div className=''>
                    <Button color="dark" className='uppercase' pill={true} size='lg'>
                        Get Started Now
                        <HiOutlineArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
