import React, { useRef, useState } from 'react'
import { Button, Tabs } from 'flowbite-react'
import { AiOutlineLogin } from 'react-icons/ai'
import { MdAccountCircle } from 'react-icons/md'
import useAPI from '../Hooks/useAPI'
import { useSelector } from 'react-redux'
// import QRCode from 'react-qr-code'
import { QRCode } from 'react-qrcode-logo';
import logo from './MetaWallet1.png'
import Select from 'react-select'

const GetStarted = () => {
    const [userdata, setuserdata] = React.useState({
        email: '',
        password1: '',
        otp: ''
    })
    const { handleLogin, handleCreateAccount, handleSocialRecovery,handleIntialization } = useAPI();
    console.log(userdata)
    const { qrLoading, userAuthenticatonSecret,gamma,hashpassword } = useSelector(state => state.users)
    console.log(qrLoading)
    const [selectedOption, setSelectedOption] = useState(null)
    const [showEmail, setShowEmail] = useState(false)
    const [emails, setEmails] = useState({
        value: 2,
        email1: '',
        email2: '',
        email3: '',
        email4: '',
    })

    return (
        <div>
            <Tabs.Group
                aria-label="Tabs with icons"
                style="underline"
                className='justify-center border-none'
                onActiveTabChange={() => {
                    setuserdata({
                        email: '',
                        password1: '',
                        token: ''
                    })
                }}
            >
                <Tabs.Item
                    title="Login"
                    active={true}
                    icon={AiOutlineLogin}
                >
                    <>
                        <h5 className="mb-3 text-base font-semibold text-gray-900 dark:text-white lg:text-xl">
                            Login to Transact with us
                        </h5>
                        <div>
                            <div className="mb-3">
                                <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder=""
                                    onChange={(e) => {
                                        setuserdata({
                                            ...userdata,
                                            email: e.target.value
                                        })
                                    }}
                                    className="block w-full px-4 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password1"
                                    id="password1"
                                    onChange={(e) => {
                                        setuserdata({
                                            ...userdata,
                                            password1: e.target.value
                                        })
                                    }}
                                    placeholder=""
                                    className="block w-full px-4 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                                />
                            </div>
                            {/* <div className="mb-3">
                                <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                    Password 2
                                </label>
                                <input
                                    type="password"
                                    name="password2"
                                    id="password2"
                                    placeholder=""
                                    onChange={(e) => {
                                        setuserdata({
                                            ...userdata,
                                            password2: e.target.value
                                        })
                                    }}
                                    className="block w-full px-4 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                                />
                            </div> */}
                            <div className="mb-3">
                                <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                    OTP
                                </label>
                                <input
                                    type="text"
                                    name="otp"
                                    id="otp"
                                    placeholder=""
                                    onChange={(e) => {
                                        setuserdata({
                                            ...userdata,
                                            otp: e.target.value
                                        })
                                    }}
                                    className="block w-full px-4 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-200">
                                    <input
                                        type="checkbox"
                                        className="text-indigo-600 form-checkbox focus:border-indigo-400 focus:outline-none focus:shadow-outline-indigo dark:focus:shadow-outline-gray"
                                    />
                                    <span className="ml-2">Remember me</span>
                                </label>
                            </div>
                            <div className="mb-3">
                                <button
                                    onClick={() => {
                                        handleLogin(userdata.email, userdata.password1, userdata.password2)
                                    }}
                                    className="w-full px-4 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-indigo-600 border border-transparent rounded-lg active:bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:shadow-outline-indigo"
                                >
                                    Login
                                </button>
                            </div>
                            <div className="mb-3">
                                <a href="#" className="block text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>
                    </>
                </Tabs.Item>
                <Tabs.Item
                    active={true}
                    title="Sign Up"
                    icon={MdAccountCircle}
                >
                    {qrLoading === 2 && <><div className='flex flex-row-reverse justify-start items-center'>
                        <div className="mb-3 text-left text-xs">
                            {/* Enter the Code or Scan QR Code using Google Authenticator App */}
                            Step-1 : Download Google Authenticator App from Store
                            <br></br>
                            Step-2: Scan the QR Code
                            <br></br>
                            Step-3: Enter the OTP
                            <br></br>
                            Step-4: Click on Next
                        </div>
                        {/* <div className="mb-3 text-center">
                            <label className="block mb-2 font-medium text-gray-600 dark:text-gray-200 overflow-x-auto text-xs">
                                Token : {userAuthenticatonSecret}
                            </label>
                        </div> */}
                        <div>
                            <QRCode
                                // size={512}

                                value={`otpauth://totp/Meta%20Wallet?secret=${userAuthenticatonSecret}`}
                                // viewBox={`0 0 256 256`}
                                mountNode
                                // logoImage = {logo}
                                // removeQrCodeBehindLogo = {true} 
                                qrStyle={'dots'}
                                eyeRadius={10}
                            />
                        </div>

                    </div>
                        {/* Add Six Digit Requirement Logic*/}
                        {/* Add OTP Type Boxes */}
                        <label className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                            OTP
                        </label>
                        <br></br>
                        <div className="mb-3 flex flex-row justify-start items-center space-x-3">
                            <input
                                type="text"
                                name="otp"
                                id="otp"
                                placeholder=""
                                onChange={(e) => {
                                    setuserdata({
                                        ...userdata,
                                        otp: e.target.value
                                    })
                                }}
                                className=" px-4 py-3 w-1/2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                            />
                            <button
                                onClick={() => {
                                    handleIntialization(userdata.otp)
                                }}
                                className="w-full px-4 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-indigo-600 border border-transparent rounded-lg active:bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:shadow-outline-indigo"
                            >
                                Intialize Meta Wallet
                            </button>
                        </div>
                    </>}
                    {(qrLoading === 0) &&
                        <>
                            <h5 className="mb-3 text-base font-semibold text-gray-900 dark:text-white lg:text-xl">
                                Start your journey with us today!
                            </h5>
                            <div>
                                <div className="mb-3">
                                    <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder=""
                                        onChange={(e) => {
                                            setuserdata({
                                                ...userdata,
                                                email: e.target.value
                                            })
                                        }}
                                        className="block w-full px-4 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password1"
                                        id="password1"
                                        onChange={(e) => {
                                            setuserdata({
                                                ...userdata,
                                                password1: e.target.value
                                            })
                                        }}
                                        placeholder=""
                                        className="block w-full px-4 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                                    />
                                </div>
                                <div className="mb-0 invisible">
                                    <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                        Password 2
                                    </label>
                                    <input
                                        type="password"
                                        name="password2"
                                        id="password2"
                                        placeholder=""
                                        className="block w-full px-4 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-200">
                                        <input
                                            type="checkbox"
                                            className="text-indigo-600 form-checkbox focus:border-indigo-400 focus:outline-none focus:shadow-outline-indigo dark:focus:shadow-outline-gray"
                                        />
                                        <span className="ml-2">Remember me</span>
                                    </label>
                                </div>
                                <div className="mb-3">
                                    <button
                                        onClick={() => {
                                            handleCreateAccount(userdata.email, userdata.password1)
                                        }}
                                        className="w-full px-4 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-indigo-600 border border-transparent rounded-lg active:bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:shadow-outline-indigo"
                                    >
                                        Sign up
                                    </button>
                                </div>
                                <div className="mb-3">

                                    <a href="#" className="block text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>
                        </>}
                    {
                        (qrLoading === 1) && <>
                            <div className="mb-3">
                                <div className='text-center'>Social Recovery Section</div>
                                <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                    Select number of Social Recovery Helpers
                                </label>
                                <div>
                                    <Button.Group>
                                        <Button color="gray" onClick={() => {
                                            setSelectedOption(2); setShowEmail(true); setEmails({
                                                ...emails, value: 2
                                            })
                                        }}>
                                            Two
                                        </Button>
                                        <Button color="gray" onClick={() => {
                                            setSelectedOption(3); setShowEmail(true); setEmails({
                                                ...emails, value: 3
                                            })
                                        }}>
                                            Three
                                        </Button>
                                        <Button color="gray" onClick={() => {
                                            setSelectedOption(4); setShowEmail(true); setEmails({
                                                ...emails, value: 4
                                            })
                                        }}>
                                            Four
                                        </Button>
                                    </Button.Group>
                                </div>
                            </div>
                            {
                                (showEmail) && <>
                                    <div className="mb-3">
                                        {(emails.value >= 2) && <div className="mb-3">
                                            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                                Email Address 1
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                placeholder=""
                                                onChange={(e) => {
                                                    setEmails({
                                                        ...emails,
                                                        email1: e.target.value
                                                    })
                                                }}
                                                className="block w-full px-4 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                                            />
                                        </div>
                                        }
                                        {(emails.value >= 2) && <div className="mb-3">
                                            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                                Email Address 2
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                placeholder=""
                                                onChange={(e) => {
                                                    setEmails({
                                                        ...emails,
                                                        email2: e.target.value
                                                    })
                                                }}
                                                className="block w-full px-4 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                                            />
                                        </div>
                                        }
                                        {(emails.value >= 3) && <div className="mb-3">
                                            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                                Email Address 3
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                placeholder=""
                                                onChange={(e) => {
                                                    setEmails({
                                                        ...emails,
                                                        email3: e.target.value
                                                    })
                                                }}
                                                className="block w-full px-4 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                                            />
                                        </div>
                                        }
                                        {(emails.value >= 4) && <div className="mb-3">
                                            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                                Email Address 4
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                placeholder=""
                                                onChange={(e) => {
                                                    setEmails({
                                                        ...emails,
                                                        email4: e.target.value
                                                    })
                                                }}
                                                className="block w-full px-4 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                                            />
                                        </div>
                                        }
                                    </div>
                                    <div className="mb-3 float-right">

                                        <div className=" text-sm font-medium leading-5 text-white transition-colors duration-150 bg-indigo-600 border border-transparent rounded-lg active:bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:shadow-outline-indigo w-[80px] text-center py-2 px-4 cursor-pointer" onClick={() => { handleSocialRecovery(gamma,hashpassword,emails) }}>
                                            Next
                                        </div>
                                    </div>
                                </>
                            }
                        </>
                    }
                </Tabs.Item>
            </Tabs.Group>
        </div>
    )
}

export default GetStarted