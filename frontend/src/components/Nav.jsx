import { Avatar, Button, Card, Dropdown, Modal, Navbar } from 'flowbite-react'
import React from 'react'
import GetStarted from './GetStarted'
import { Login } from './Login'
import { Signup } from './Signup'

export const Nav = () => {
    const [show, setShow] = React.useState(false)
    const [showsignup, setShowsignup] = React.useState(false)
    const onClose = () => {
        // console.log('close')
        setShow(false)
        setShowsignup(false)
    }

    return (
        <>
            <Modal
                show={show}
                onClose={onClose}
                size="md"
                popup={true}
            >
                <Modal.Header />
                <Modal.Body>
                    <GetStarted />
                </Modal.Body>
            </Modal>
            <Modal
                show={showsignup}
                onClose={onClose}
                size="md"
                popup={true}
            >
                <Modal.Header />
                <Modal.Body>
                    <Signup />
                </Modal.Body>
            </Modal>
            <div className='bg-[#192134]'>

                <nav class=" border-gray-200 px-2 sm:px-4 py-2.5 rounded bg-[#192134]">
                    <div class="container flex flex-wrap items-center justify-between mx-auto">
                        <a href="/" class="flex items-center">
                            <img src="https://flowbite.com/docs/images/logo.svg" class="h-6 mr-3 sm:h-9" alt="Flowbite Logo" />
                            <span class="self-center text-xl font-semibold whitespace-nowrap text-white">MetaWallet</span>
                        </a>
                        {/* <!-- Dropdown menu --> */}
                        <div class="flex items-center md:order-2">
                            {/* <button type="button" class="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4  focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                                <span class="sr-only">Open user menu</span>
                                <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="user photo" />
                            </button> */}
                           <div class="z-50 hidden my-4 text-base list-none divide-0 rounded-lg shadow bg-gray-700 divide-gray-600" id="user-dropdown">
                                <div class="px-4 py-3">
                                    <span class="block text-sm text-gray-900 text-white">Bonnie Green</span>
                                    <span class="block text-sm font-medium text-gray-500 truncate text-gray-400">name@flowbite.com</span>
                                </div>
                                <ul class="py-2" aria-labelledby="user-menu-button">
                                    <li>
                                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:bg-gray-600 text-gray-200 hover:text-white">Dashboard</a>
                                    </li>
                                    <li>
                                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:bg-gray-600 text-gray-200 hover:text-white">Settings</a>
                                    </li>
                                    <li>
                                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:bg-gray-600 text-gray-200 hover:text-white">Earnings</a>
                                    </li>
                                    <li>
                                        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:bg-gray-600 text-gray-200 hover:text-white">Sign out</a>
                                    </li>
                                </ul>
                            </div>
                            <button data-collapse-toggle="mobile-menu-2" type="button" class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-400 hover:bg-gray-700 focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                                <span class="sr-only">Open main menu</span>
                                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                            </button>
                            <Button onClick={()=>{setShow(true)}}>
                                Get started
                            </Button>
                        </div>
                        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="mobile-menu-2">
                            <ul class="flex flex-col p-4 mt-4 border  rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 bg-[#192134] border-gray-700">
                                <li>
                                    <a href="#" class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 text-white" aria-current="page">Home</a>
                                </li>
                                <li>
                                    <a href="#" class="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 text-gray-400 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700">Explore</a>
                                </li>
                                <li>
                                    <a href="#" class="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 text-gray-400 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700">Transact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
}
