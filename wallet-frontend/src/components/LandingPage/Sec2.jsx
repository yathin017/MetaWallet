import { Card } from 'flowbite-react'
import React from 'react'

export const Sec2 = () => {
    return (
        <div className='flex flex-col justify-center items-center'>
            <div>
                <div className='text-4xl tracking-wide font-semibold pb-6'>
                    Why MetaWallet ?
                </div>
            </div>
            <div className='grid grid-cols-3 place-content-between place-items-center my-3 gap-x-4'>
                <div>
                    <div className="justify-center flex flex-col items-center bg-[#f7f6f8] rounded-lg">
                        <img className="h-52" src="./assets/crypto.gif" alt="Meaningful alt text for an image that is not purely decorative" />
                        <Card className='bg-[#f7f6f8] border-t-1 rounded-t-none'>
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Transact in Cryptocurrency
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                            At the best prices, purchase cryptocurrency with your bank account or credit card.
                            </p>
                        </Card>
                    </div>
                </div>
                <div>
                    <div className="justify-center flex flex-col items-center bg-[#f7f6f8] rounded-lg">
                        <img className="h-52" src="./assets/earn.gif" alt="Meaningful alt text for an image that is not purely decorative" />
                        <Card className='bg-[#f7f6f8] border-t-1 rounded-t-none'>
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Earn interest on your crypto
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                            Earn exchange fees by providing liquidity to pools on MetaWallet.
                            </p>
                        </Card>
                    </div>
                </div>
                <div>
                    <div className="justify-center flex flex-col items-center bg-[#f7f6f8] rounded-lg">
                        <img className="h-52" src="./assets/dapps.gif" alt="Meaningful alt text for an image that is not purely decorative" />
                        <Card className='bg-[#f7f6f8] border-t-1 rounded-t-none'>
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Build dApps
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                            Build apps and tools on the largest DeFi protocol on Ethereum.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
