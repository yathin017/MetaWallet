import { Button, Card } from 'flowbite-react'
import React from 'react'
import { BsArrowDownLeftCircleFill, BsArrowUpLeftCircleFill, BsFillCalendarDateFill } from 'react-icons/bs'

export const Sec2 = () => {
    return (
        <div className='flex flex-col justify-start items-start'>
            <Card className=''>
                <div className='flex flex-row justify-between w-full items-center'>
                    <div className='text-2xl font-semibold tracking-wide'>
                        Recent Transactions
                    </div>
                    <div>
                        <Button color='dark'>View All</Button>
                    </div>
                </div>
                <div className='pt-2 grid grid-cols-4 gap-x-10 place-content-start place-items-center'>
                    <div className='flex flex-row justify-start items-center space-x-3'>
                        <div>
                            <BsArrowUpLeftCircleFill size={25} />
                        </div>
                        <div className='text-lg'>
                            Send                         </div>
                    </div>
                    <div>
                        Rony Joseph
                    </div>
                    <div className='flex flex-row justify-start items-center space-x-3'>
                        <div>
                            <BsFillCalendarDateFill/>
                        </div>
                        <div>
                            Dec 24,2021
                        </div>  
                    </div>
                    <div>
                        BTC 2
                    </div>
                </div>
                <div className='pt-2 grid grid-cols-4 gap-x-10 place-content-start place-items-center'>
                    <div className='flex flex-row justify-start items-center space-x-3'>
                        <div>
                            <BsArrowDownLeftCircleFill size={25} />
                        </div>
                        <div className='text-lg'>
                            Receive
                        </div>
                    </div>
                    <div>
                        Rony Joseph
                    </div>
                    <div className='flex flex-row justify-start items-center space-x-3'>
                        <div>
                        <BsFillCalendarDateFill/>
                        </div>
                        <div>
                            Dec 24,2021
                        </div>
                    </div>
                    <div>
                        BTC 2
                    </div>
                </div>

            </Card>
        </div>
    )
}
