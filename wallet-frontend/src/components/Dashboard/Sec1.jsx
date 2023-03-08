import { Button, Card, Modal } from 'flowbite-react'
import React, { useState } from 'react'
import { BsArrowDownLeft, BsArrowUpRight } from 'react-icons/bs'
import { SendCrypto } from './SendCrypto'

export const Sec1 = () => {
    const [show, setshow] = useState(false)
    const onClose = ()=>{
        setshow(false)
    }
    return (
        <>
        <Modal 
            show={show}
            onClose={onClose}
        >
            <Modal.Header>Transfer Crypto</Modal.Header>
            <Modal.Body>
                <SendCrypto />
            </Modal.Body>
        </Modal>
        <div className='flex flex-col justify-start items-start space-y-3'>
            <div className='text-2xl tracking-wide font-light'>
                Hello Arthur!
            </div>
            <div className='flex flex-row justify-between space-x-10 '>
                <Card className=''>
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Wallet Details
                    </h5>
                    {/* <p className="font-normal text-gray-700 dark:text-gray-400">
                        Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
                    </p> */}
                    <div className='grid grid-cols-3 justify-evenly items-start gap-x-10'>
                        <div className='flex flex-row justify-start items-center space-x-3'>
                            <div className='bg-black h-10 w-10 rounded-full'>hi</div>
                            <div className='flex flex-col justify-start items-start'>
                                <div className='font-normal uppercase text-lg'>
                                    Wallet Address
                                </div>
                                <div className='text-base'>
                                    OSDASFAFFLFADLKADL
                                </div>
                            </div>
                        </div>
                        <div className='border-l px-10'>
                            <div className='flex flex-col justify-start items-start'>
                                <div className='font-normal uppercase text-lg'>
                                    STATUS
                                </div>
                                <div className='text-base'>
                                    Active
                                </div>
                            </div>
                        </div>
                        <div className='border-l px-10'>
                            <div className='flex flex-col justify-start items-start'>
                                <div className='font-normal uppercase text-lg'>
                                    STATUS
                                </div>
                                <div className='text-base'>
                                    Active
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <Button>
                        Read more
                        <svg
                            className="ml-2 -mr-1 h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Button> */}
                </Card>
                <Card className=''>
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Schedule Transfer
                    </h5>
                    <div className='flex flex-row items-center justify-center space-x-6'>
                        <Button color="warning" pill={true} size='sm' onClick={()=>{setshow(true)}}>
                            <BsArrowUpRight className="mr-3 h-6 w-6" />
                            <span className='text-lg'>Send</span>
                        </Button>
                        <Button color="warning" pill={true} size='sm'>
                            <BsArrowDownLeft className="mr-3 h-6 w-6" />
                            <span className='text-lg'>Receive</span>
                        </Button>
                    </div>
                </Card>


            </div>

        </div>
        </>
    )
}
