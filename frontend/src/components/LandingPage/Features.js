import React, { useState, useRef, useEffect } from 'react';
import Transition from './Transition';

import First from './assets/1.jpg';
import Second from './assets/2.jpg';
import Third from './assets/3.jpg';
import Fourth from './assets/4.jpg';

function Features() {

    const [tab, setTab] = useState(1);

    const tabs = useRef(null);

    const heightFix = () => {
        if (tabs.current.children[tab]) {
            tabs.current.style.height = tabs.current.children[tab - 1].offsetHeight + 'px'
        }
    }

    useEffect(() => {
        heightFix()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab])

    return (
        <section className="relative">

            {/* Section background (needs .relative class on parent and next sibling elements) */}
            <div className="absolute inset-0 bg-[#192134] pointer-events-none" aria-hidden="true"></div>
            {/* <div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-[#00152460] transform -translate-y-1/2"></div> */}

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-gray-200">
                <div className="pt-12 md:pt-20">

                    {/* Section header */}

                    {/* Section content */}
                    <div className="md:grid md:grid-cols-12 md:gap-6">
                        {/* Content */}
                        <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6 md:mt-6" data-aos="fade-right">
                            <div className="md:pr-4 lg:pr-12 xl:pr-16 mb-8">
                                <h3 className="h3 text-2xl mb-3">Guide to create your Meta Wallet 🧑‍🏫</h3>
                            </div>
                            {/* Tabs buttons */}
                            <div className="mb-8 md:mb-0">
                                <a
                                    className={`flex items-center  justify-between text-base p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 1 ? 'bg-[#001524] shadow-md border-[#001524] hover:shadow-lg' : 'bg-[#00152460] border-transparent'}`}
                                    href="#0"
                                    onClick={(e) => { e.preventDefault(); setTab(1); }}
                                >
                                    <div>
                                        <div className="font-bold leading-snug tracking-tight mb-1 text-gray-300">Verify your Email</div>
                                        <div className="text-gray-300">Click on sign up with Google account, so that we can verify you 🤝</div>
                                    </div>
                                    <div className="flex justify-center items-center w-8 h-8 bg-[#7ebdea] rounded-full shadow flex-shrink-0 ml-3">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.953 4.29a.5.5 0 00-.454-.292H6.14L6.984.62A.5.5 0 006.12.173l-6 7a.5.5 0 00.379.825h5.359l-.844 3.38a.5.5 0 00.864.445l6-7a.5.5 0 00.075-.534z" fill="#191919" />
                                        </svg>
                                    </div>
                                </a>
                                <a
                                    className={`flex items-center  justify-between text-base p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 2 ? 'bg-[#001524] shadow-md border-[#001524] hover:shadow-lg' : 'bg-[#00152460] border-transparent'}`}
                                    href="#0"
                                    onClick={(e) => { e.preventDefault(); setTab(2); }}
                                >
                                    <div>
                                        <div className="font-bold leading-snug tracking-tight mb-1">Create your Meta Wallet password</div>
                                        <div className="text-gray-300">Make sure your password is a secret 🤫. We have no clue about your password 🙅‍♂🙅‍♀</div>
                                    </div>
                                    <div className="flex justify-center items-center w-8 h-8 bg-[#7ebdea] rounded-full shadow flex-shrink-0 ml-3">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.854.146a.5.5 0 00-.525-.116l-11 4a.5.5 0 00-.015.934l4.8 1.921 1.921 4.8A.5.5 0 007.5 12h.008a.5.5 0 00.462-.329l4-11a.5.5 0 00-.116-.525z" fill="#191919" fillRule="nonzero" />
                                        </svg>
                                    </div>
                                </a>
                                <a
                                    className={`flex items-center  justify-between text-base p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 3 ? 'bg-[#001524] shadow-md border-[#001524] hover:shadow-lg' : 'bg-[#00152460] border-transparent'}`}
                                    href="#0"
                                    onClick={(e) => { e.preventDefault(); setTab(3); }}
                                >
                                    <div>
                                        <div className="font-bold leading-snug tracking-tight mb-1">Initialize your brand new Meta Wallet</div>
                                        <div className="text-gray-300">Complete the 2FA to use the most secured wallet ever 🥳</div>
                                    </div>
                                    <div className="flex justify-center items-center w-8 h-8 bg-[#7ebdea] rounded-full shadow flex-shrink-0 ml-3">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.334 8.06a.5.5 0 00-.421-.237 6.023 6.023 0 01-5.905-6c0-.41.042-.82.125-1.221a.5.5 0 00-.614-.586 6 6 0 106.832 8.529.5.5 0 00-.017-.485z" fill="#191919" fillRule="nonzero" />
                                        </svg>
                                    </div>
                                </a>
                                <a
                                    className={`flex items-center  justify-between text-base p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 4 ? 'bg-[#001524] shadow-md border-[#001524] hover:shadow-lg' : 'bg-[#00152460] border-transparent'}`}
                                    href="#0"
                                    onClick={(e) => { e.preventDefault(); setTab(4); }}
                                >
                                    <div>
                                        <div className="font-bold leading-snug tracking-tight mb-1">Login using email and password</div>
                                        <div className="text-gray-300">We don't burden you asking about seed phrases 😇</div>
                                    </div>
                                    <div className="flex justify-center items-center w-8 h-8 bg-[#7ebdea] rounded-full shadow flex-shrink-0 ml-3">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.334 8.06a.5.5 0 00-.421-.237 6.023 6.023 0 01-5.905-6c0-.41.042-.82.125-1.221a.5.5 0 00-.614-.586 6 6 0 106.832 8.529.5.5 0 00-.017-.485z" fill="#191919" fillRule="nonzero" />
                                        </svg>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Tabs items */}
                        <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1" data-aos="zoom-y-out" ref={tabs}>
                            <div className="relative flex flex-col text-center lg:text-right">
                                {/* Item 1 */}
                                <Transition
                                    show={tab === 1}
                                    appear={true}
                                    className="w-full"
                                    enter="transition ease-in-out duration-700 transform order-first"
                                    enterStart="opacity-0 translate-y-16"
                                    enterEnd="opacity-100 translate-y-0"
                                    leave="transition ease-in-out duration-300 transform absolute"
                                    leaveStart="opacity-100 translate-y-0"
                                    leaveEnd="opacity-0 -translate-y-16"
                                >
                                    <div className="mt-36 relative inline-flex justify-start items-center flex-col">
                                        <img className="md:max-w-none mx-auto rounded" src={First} width="500" height="462" alt="Features bg" />
                                    </div>
                                </Transition>
                                {/* Item 2 */}
                                <Transition
                                    show={tab === 2}
                                    appear={true}
                                    className="w-full"
                                    enter="transition ease-in-out duration-700 transform order-first"
                                    enterStart="opacity-0 translate-y-16"
                                    enterEnd="opacity-100 translate-y-0"
                                    leave="transition ease-in-out duration-300 transform absolute"
                                    leaveStart="opacity-100 translate-y-0"
                                    leaveEnd="opacity-0 -translate-y-16"
                                >
                                    <div className="relative inline-flex justify-start items-center flex-col">
                                        <img className="md:max-w-none mx-auto rounded" src={Second} width="500" height="462" alt="Features bg" />
                                    </div>
                                </Transition>
                                {/* Item 3 */}
                                <Transition
                                    show={tab === 3}
                                    appear={true}
                                    className="w-full"
                                    enter="transition ease-in-out duration-700 transform order-first"
                                    enterStart="opacity-0 translate-y-16"
                                    enterEnd="opacity-100 translate-y-0"
                                    leave="transition ease-in-out duration-300 transform absolute"
                                    leaveStart="opacity-100 translate-y-0"
                                    leaveEnd="opacity-0 -translate-y-16"
                                >
                                    <div className="mt-12 relative inline-flex justify-start items-center flex-col">
                                        <img className="md:max-w-none mx-auto rounded" src={Third} width="500" height="462" alt="Features bg" />
                                    </div>
                                </Transition>
                                <Transition
                                    show={tab === 4}
                                    appear={true}
                                    className="w-full"
                                    enter="transition ease-in-out duration-700 transform order-first"
                                    enterStart="opacity-0 translate-y-16"
                                    enterEnd="opacity-100 translate-y-0"
                                    leave="transition ease-in-out duration-300 transform absolute"
                                    leaveStart="opacity-100 translate-y-0"
                                    leaveEnd="opacity-0 -translate-y-16"
                                >
                                    <div className="relative inline-flex justify-start items-center flex-col">
                                        <img className="md:max-w-none mx-auto rounded" src={Fourth} width="500" height="462" alt="Features bg" />
                                    </div>
                                </Transition>
                            </div>
                        </div >

                    </div >

                </div >
            </div >
        </section >
    );
}

export default Features;