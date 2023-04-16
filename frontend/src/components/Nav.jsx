import { Avatar, Button, Card, Dropdown, Modal, Navbar } from 'flowbite-react'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import GetStarted from './GetStarted'
import { Login } from './Login'
import { Signup } from './Signup'

export const Nav = ({ show, onClose, setShow }) => {

    // const [showsignup, setShowsignup] = React.useState(false)
    // const onClose = () => {
    //     // console.log('close')
    //     setShow(false)
    //     // setShowsignup(false)
    // }
    const { isUserLoggedin, userData } = useSelector(state => state.users);
    const [showSettingsPanel, setshowSettingsPanel] = React.useState(false)
    const navigate = useNavigate()
    // const ref = useRef(null);
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //       if (ref.current && !ref.current.contains(event.target)) {
    //         setshowSettingsPanel(false)
    //       }
    //     };
    //     document.addEventListener('click', handleClickOutside, true);
    //     return () => {
    //       document.removeEventListener('click', handleClickOutside, true);
    //     };
    //   }, []);
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
                    <GetStarted onClose={onClose} setShow={setShow} />
                </Modal.Body>
            </Modal>
            {/* <Modal
                show={showsignup}
                onClose={onClose}
                size="md"
                popup={true}
            >
                <Modal.Header />
                <Modal.Body>
                    <Signup />
                </Modal.Body>
            </Modal> */}
            <div className='bg-[#192134]'>

                <nav class=" border-gray-200 px-2 sm:px-4 py-2.5 rounded bg-[#192134]">
                    <div class="container flex flex-wrap items-center justify-between mx-auto">
                        <a href="/" class="flex items-center">
                            <img src="./MetaWallet1.svg" class="w-[140px]" alt="Flowbite Logo" />
                            {/* <span class="self-center text-xl font-semibold whitespace-nowrap text-white">MetaWallet</span> */}
                        </a>
                        {/* <!-- Dropdown menu --> */}
                        <div class="flex items-center md:order-2">
                            {/* <button type="button" class="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4  focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                                <span class="sr-only">Open user menu</span>
                                <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="user photo" />
                            </button> */}
                            {
                                isUserLoggedin ? (
                                    <>
                                        <button id="dropdownDefaultButton" onClick={() => { setshowSettingsPanel(!(showSettingsPanel)) }} data-dropdown-toggle="dropdown" class="text-white  text-sm p-4 text-center inline-flex items-center h-10" type="button">
                                            <img src={userData?.picture} className='rounded-[100%] h-10' />
                                        </button>
                                        {
                                            showSettingsPanel && (
                                                <div id="dropdown" class="text-white z-10 divide-y divide-gray-100 rounded-lg shadow w-44 bg-gray-700 absolute top-[11%] right-[1%]">
                                                    <ul class="py-2 text-sm text-gray-200" aria-labelledby="dropdownDefaultButton">
                                                        <li>
                                                            <div onClick={() => { navigate('/dashboard') }} class="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer">Dashboard</div>
                                                        </li>
                                                        <li>
                                                            <div onClick={() => { navigate('/settings') }} class="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer">Settings</div>
                                                        </li>
                                                        {/* <li>
                                                            <a href="#" class="block px-4 py-2 hover:bg-gray-600 hover:text-white">Earnings</a>
                                                        </li> */}
                                                        <li>
                                                            <a href="/" class="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer">Sign out</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )
                                        }
                                    </>

                                ) : (
                                    <Button onClick={() => { setShow(true) }}>
                                        Get started
                                    </Button>
                                )
                            }
                        </div>
                        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="mobile-menu-2">
                            <ul class="flex flex-col p-4 mt-4 border  rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 bg-[#192134] border-gray-700">
                                <li>
                                    <Link to='/' class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 text-white" aria-current="page">Home</Link>
                                </li>
                                {/* <li>
                                    <Link to='/' class="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover :text-blue-700 md:p-0 text-gray-400 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700">Explore</Link>
                                </li> */}
                                <li>
                                    <Link to='/dashboard' class="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 text-gray-400 md:hover:text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700">Transact</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
}
