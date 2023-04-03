import React, { useEffect, useRef, useState } from 'react'
import { Button, Tabs } from 'flowbite-react'
import { AiOutlineLogin } from 'react-icons/ai'
import { MdAccountCircle } from 'react-icons/md'
import useAPI from '../Hooks/useAPI'
import { useSelector } from 'react-redux'
// import QRCode from 'react-qr-code'
import { QRCode } from 'react-qrcode-logo';
import logo from '../assets/Logo-Transparent.svg'
import { GoogleLogin } from '@react-oauth/google'
import jwtDecode from 'jwt-decode'
import OTPInput from 'otp-input-react'

const GetStarted = ({ onClose, setShow }) => {
    const [matchingPasswords, setMatchingPasswords] = useState(false)
    const { handleLogin, handleCreateAccount, handleIntialization, handleGmailSuccess } = useAPI();
    const { qrLoading, userAuthenticatonSecret, gamma, userData, loginLoading } = useSelector(state => state.users)
    const [selectedOption, setSelectedOption] = useState(0)
    const [showEmail, setShowEmail] = useState(false)
    const [otp, setOtp] = useState('')
    const [userdata, setuserdata] = React.useState({
        password1: '',
        password2: '',
    })
    const [emails, setEmails] = useState({
        value: 0,
        email1: '',
        email2: '',
        email3: '',
        email4: '',
    })
    useEffect(() => {
        if (userdata.password1 === userdata.password2 && userdata.password1 !== '' && userdata.password2 !== '') {
            setMatchingPasswords(true)
        }
        else {
            setMatchingPasswords(false)
        }
    }, [userdata])

    const downloadTxtFile = () => {
        const element = document.createElement("a");
        const file = new Blob([userData?.secretShare],
            { type: 'text/plain;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.readOnly = true;
        element.download = "Secret.txt";
        document.body.appendChild(element);
        element.click();
    }

    const GoogleLoginComponent = () => {
        return (
            <div className="mb-3 text-center flex flex-col justify-center items-center space-y-5">
                <div>
                    <div className='text-xl text-gray-700'>Continue using Meta Wallet</div>
                    <div className='text-md text-gray-500 whitespace-nowrap'>Use your Google Account to verify your email <br></br><span className='font-semibold'>Get Started Now!</span></div>
                </div>
                <GoogleLogin
                    theme='filled_black'
                    text={'continue_with'}
                    shape='pill'
                    logo_alignment='left'
                    onSuccess={(credentialResponse) => {
                        if (credentialResponse.credential != null) {
                            const USER_CREDENTIAL = jwtDecode(credentialResponse.credential);
                            handleGmailSuccess(USER_CREDENTIAL?.email, USER_CREDENTIAL?.picture, 'login')
                        }
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />
            </div>
        )
    }
    const GoogleSignupComponent = () => {
        return (
            <div className="mb-3 text-center flex flex-col justify-center items-center space-y-5">
                <div>
                    <div className='text-xl text-gray-700'>Start using Meta Wallet</div>
                    <div className='text-md text-gray-500'>Use your Google Account to verify your email</div>
                </div>
                <GoogleLogin
                    theme='filled_black'
                    text={'signup_with'}
                    shape='pill'
                    logo_alignment='left'
                    onSuccess={(credentialResponse) => {
                        console.log(credentialResponse);
                        if (credentialResponse.credential != null) {
                            const USER_CREDENTIAL = jwtDecode(credentialResponse.credential);
                            handleGmailSuccess(USER_CREDENTIAL?.email, USER_CREDENTIAL?.picture, 'signup')
                        }
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />
            </div>
        )
    }


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
                        password2: '',
                    });
                    setOtp('')
                }}
            >
                <Tabs.Item
                    title="Login"
                    icon={AiOutlineLogin}
                >
                    <>

                        {
                            (loginLoading === 0) && <>
                                {<GoogleLoginComponent type={'login'} />}
                            </>
                        }
                        {(loginLoading) === 1 && <div>
                            <h5 className="mb-3 text-base font-semibold text-gray-900 dark:text-white lg:text-xl">
                                Login to Transact with us
                            </h5>
                            <div className="mb-3">
                                <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder={userData.email}
                                    disabled
                                    readonly
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
                            <div className="mb-3">
                                <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                    OTP
                                </label>
                                <OTPInput
                                    value={otp}
                                    onChange={setOtp}
                                    OTPLength={6}
                                    otpType='number'
                                    autoFocus={true}
                                    inputStyles={
                                        {
                                            height: '45px',
                                            width: '40px',
                                            borderRadius: '7px',
                                            marginLeft: '8px',
                                            marginRight: '8px',
                                            padding: '1px',
                                        }
                                    }
                                />
                            </div>
                            <div className="mb-3">
                                <button
                                    onClick={() => {
                                        handleLogin(userData.email, userdata.password1, otp, setShow);
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
                        }
                    </>
                </Tabs.Item>
                <Tabs.Item
                    active={true}
                    title="Sign Up"
                    icon={MdAccountCircle}
                >
                    {qrLoading === 2 && <>

                        {/* <div className="mb-3 text-center">
                            <label className="block mb-2 font-medium text-gray-600 dark:text-gray-200 overflow-x-auto text-xs" onClick={downloadTxtFile}>
                                Download Secret Share
                            </label>
                        </div> */}
                        <div className='flex flex-row-reverse justify-start items-center'>
                            <div className="mb-3 text-left text-xs flex flex-col justify-start items-start  space-y-1">
                                <div className='text-lg font-bold whitespace-nowrap'>
                                    Steps to Enable 2FA
                                </div>
                                <div className=''>
                                    <span className='font-semibold'>Step-1 : </span>Install Google Auth
                                </div>
                                <div className=''>
                                    <span className='font-semibold'>Step-2 : </span>Scan the QR Code
                                </div>
                                <div className=''>
                                    <span className='font-semibold'>Step-3 : </span>Enter the OTP
                                </div>
                                <div className=''>
                                    <span className='font-semibold'>Step-4 : </span>Click on Next
                                </div>
                            </div>
                            <div>
                                <QRCode
                                    // size={512}

                                    value={`otpauth://totp/Meta%20Wallet?secret=${userAuthenticatonSecret}`}
                                    // viewBox={`0 0 256 256`}
                                    mountNode
                                    logoImage={logo}
                                    removeQrCodeBehindLogo={true}
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
                        <div className="mb-3 text-gray-800">
                            <OTPInput
                                value={otp}
                                onChange={setOtp}
                                OTPLength={6}
                                otpType='number'
                                autoFocus={true}
                                inputStyles={
                                    {
                                        height: '45px',
                                        width: '40px',
                                        borderRadius: '7px',
                                        marginLeft: '8px',
                                        marginRight: '8px',
                                        padding: '1px',
                                    }
                                }
                            />
                        </div>
                        <button
                            onClick={() => {
                                if (otp.length === 6) {
                                    console.log("OTP", )
                                    handleIntialization(otp, userData.hashemail, userData.walletAddress);
                                    downloadTxtFile();
                                }
                            }}
                            className={`w-full float-right px-4 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-indigo-600 border border-transparent rounded-lg active:bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:shadow-outline-indigo ${otp.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Intialize Meta Wallet
                        </button>
                    </>}
                    {(qrLoading === 0) &&
                        <>
                            <h5 className="mb-3 text-base font-semibold text-gray-900 dark:text-white lg:text-xl">
                                Start your journey with us today!
                            </h5>
                            <div>
                                {/* <div>Passwords do not match!</div> */}
                                <div className="mb-3">
                                    <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder={userData.email}
                                        disabled
                                        readonly
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
                                <div className="mb-3">
                                    <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                                        Confirm Password
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
                                        className="block w-full px-4 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray "
                                    />
                                </div>
                                <div className="mb-3">
                                    <button
                                        onClick={() => {
                                            if (matchingPasswords) {
                                                handleCreateAccount(userData.email, userdata.password1);
                                            }
                                            else {
                                                window.alert("Passwords do not match!")
                                            }
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
                                        <Button color={selectedOption === 0 ? 'info' : 'gray'} onClick={() => {
                                            setSelectedOption(0); setShowEmail(true); setEmails({
                                                ...emails, value: 0
                                            })
                                        }}>
                                            Zero
                                        </Button>
                                        <Button color={selectedOption === 2 ? 'info' : 'gray'} onClick={() => {
                                            setSelectedOption(2); setShowEmail(true); setEmails({
                                                ...emails, value: 2
                                            })
                                        }}>
                                            Two
                                        </Button>
                                        <Button color={selectedOption === 3 ? 'info' : 'gray'} onClick={() => {
                                            setSelectedOption(3); setShowEmail(true); setEmails({
                                                ...emails, value: 3
                                            })
                                        }}>
                                            Three
                                        </Button>
                                        <Button color={selectedOption === 4 ? 'info' : 'gray'} onClick={() => {
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
                                </>
                            }
                            <div className="mb-3 float-right">
                                {/* <div className=" text-sm font-medium leading-5 text-white transition-colors duration-150 bg-indigo-600 border border-transparent rounded-lg active:bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:shadow-outline-indigo w-[80px] text-center py-2 px-4 cursor-pointer" onClick={() => { handleSocialRecovery(userData.hashemail, userData.alpha, userData.CrInv, userData.hashpassword, emails) }}>
                                    Next
                                </div> */}
                            </div>
                        </>
                    }
                    {
                        (qrLoading === 3) && <>
                            <div className="mb-3 text-center flex flex-col justify-center items-center space-y-2">
                                <div className='text-3xl'>
                                    Welcome to Meta Wallet!
                                </div>
                                <div className='text-md'>
                                    Meta Wallet : Your Smart Private Wallet
                                </div>
                            </div>
                            <div className=" text-sm font-medium leading-5 text-white transition-colors duration-150 bg-indigo-600 border border-transparent rounded-lg active:bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:shadow-outline-indigo text-center py-2 px-4 cursor-pointer mt-3" onClick={onClose}>
                                Start Now!
                            </div>
                        </>
                    }
                    {
                        (qrLoading === -1) && <>
                            {<GoogleSignupComponent />}
                        </>
                    }


                </Tabs.Item>
            </Tabs.Group>
        </div>
    )
}

export default GetStarted