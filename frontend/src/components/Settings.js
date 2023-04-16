import React, { useEffect } from 'react'
import OTPInput from 'otp-input-react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useAPI from '../Hooks/useAPI';

const Settings = ({ show, onClose, setShow }) => {
    const { userData } = useSelector(state => state.users);
    const [activeTab, setActiveTab] = React.useState('profile');
    const navigate = useNavigate();
    useEffect(() => {
        if (userData.privateKey === null) {
            navigate('/')
            setShow(true)
        }
    }, [userData])
    const { handleRekeying,handleDelete } = useAPI();
    const [showModal, setShowModal] = React.useState(false);
    const [otp, setOtp] = React.useState('');
    const [userdata, setuserdata] = React.useState({
        password1: '',
        password2: '',
    })
    console.log(userData)
    return (
        <>
            {/* {showModal && (<div id="popup-modal" tabindex="-1" class="fixed top-0 left-0 z-50 p-4 overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full">
                <div class="relative w-fit left-[39%] top-[5%]">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="popup-modal" onClick={()=>{setShowModal(false)}}>
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                        <div class="p-6 text-center">
                            
                            <h3 class="my-10 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to rekey this account?<br></br>Enter OTP to continue!</h3>
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
                            <button data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 my-5">
                                Yes, I'm sure
                            </button>
                            <button data-modal-hide="popup-modal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={()=>{setShowModal(false)}}>No, cancel</button>
                        </div>
                    </div>
                </div>
            </div>)} */}
            <div class="container mx-2 md:mx-10 max-w-sm md:max-w-3xl my-8">
                <h1 class="text-2xl font-bold text-gray-300 px-6 md:px-0">Account Settings</h1>
                <ul class="flex border-b border-gray-300 text-sm font-medium text-gray-200 mt-3 px-6 md:px-0">
                    <li class={`mr-8 ${activeTab === 'profile' ? 'text-gray-400' : ''} hover:text-gray-400 border-b-2 border-gray-800 py-4 cursor-pointer`} onClick={() => { setActiveTab('profile');setOtp('') }}>Profile Info</li>
                    {/* <li class={`mr-8 ${activeTab === 'social' ? 'text-gray-400' : ''} hover:text-gray-400 border-b-2 border-gray-800 py-4 cursor-pointer`} onClick={() => { setActiveTab('social') }}>Social Recovery</li> */}
                    <li class={`mr-8 ${activeTab === 'rekey' ? 'text-gray-400' : ''} hover:text-gray-400 border-b-2 border-gray-800 py-4 cursor-pointer`} onClick={() => { setActiveTab('rekey');setOtp('') }}>Rekeying</li>
                    <li class={`mr-8 ${activeTab === 'rekey' ? 'text-gray-400' : ''} hover:text-gray-400 border-b-2 border-gray-800 py-4 cursor-pointer`} onClick={() => { setActiveTab('delete');setOtp('') }}>Delete Account</li>
                </ul>
                {
                    activeTab === 'profile' && (
                        <div class="w-full rounded-lg mx-auto mt-8 flex overflow-hidden rounded-b-none">
                            <div class="w-1/3 bg-opacity-70 p-8 hidden md:inline-block">
                                <h2 class="font-medium text-2xl text-gray-400 mb-4 tracking-wide">Profile Info</h2>
                                {/* <p class="text-xs text-gray-300">Update your basic profile information such as Email Address, Name, and Image.</p> */}
                            </div>
                            <div class="md:w-2/3 w-full">
                                <div class="py-4 md:py-8 px-8 md:px-16">
                                    <label for="name" class="text-sm text-gray-400">Wallet Address</label>
                                    <input class="mt-2 border-2 border-gray-200 px-3 py-2 block w-full rounded-lg text-base text-gray-900 focus:outline-none focus:border-indigo-500 placeholder-gray-900" type="text" value="" name="name" placeholder={userData.walletAddress} disabled readOnly />
                                </div>
                                <hr class="border-gray-200" />
                                <div class="py-4 md:py-8 px-8 md:px-16">
                                    <label for="email" class="text-sm text-gray-400">Email Address</label>
                                    <input class="mt-2 border-2 border-gray-200 px-3 py-2 block w-full rounded-lg text-base text-gray-900 focus:outline-none focus:border-indigo-500 placeholder-gray-900" type="email" name="email" value="" placeholder={userData.email} disabled readOnly />
                                </div>
                                <hr class="border-gray-200" />
                                <div class="py-8 px-16 clearfix">
                                    <label for="photo" class="text-sm text-gray-400 w-full block">Photo</label>
                                    <img class="rounded-full w-16 h-16 border-4 mt-2 border-gray-200 float-left" id="photo" src={userData.picture} alt="photo" />
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    activeTab === 'rekey' && (
                        <div class="w-full rounded-lg mx-auto mt-8 flex overflow-hidden rounded-b-none">
                            <div class="w-2/3 bg-opacity-70 p-8 hidden md:inline-block">
                                <h2 class="font-medium text-2xl text-gray-400 mb-4 tracking-wide">Rekeying</h2>
                                <p class="text-sm text-gray-200"></p>
                                <div className="my-3">
                                    <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-gray-200">
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
                                        className="block w-full px-4 py-3 text-sm leading-tight text-gray-200 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                                    />
                                </div>
                                <div className="my-3">
                                    <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-gray-200">
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
                                <button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 my-10" onClick={() => { handleRekeying(userData.email,userdata.password1,userData.alpha,userData.CrInv,userData.publicKey,userData.walletAddress,otp) }}>Confirm Rekeying</button>
                            </div>
                        </div>
                    )
                }
                {
                    activeTab === 'delete' && (
                        <div class="w-full rounded-lg mx-auto mt-8 flex overflow-hidden rounded-b-none">
                            <div class="w-2/3 bg-opacity-70 p-8 hidden md:inline-block">
                                <h2 class="font-medium text-2xl text-gray-400 mb-4 tracking-wide">Delete Account</h2>
                                <p class="text-sm text-gray-200"></p>
                                <div className="my-3">
                                    <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-gray-200">
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
                                        className="block w-full px-4 py-3 text-sm leading-tight text-gray-200 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                                    />
                                </div>
                                <div className="my-3">
                                    <label className="block mb-2 text-sm font-medium text-gray-200 dark:text-gray-200">
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
                                <button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 my-10" onClick={() => { handleDelete(userData.email,otp) }}>Delete Account</button>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}
// onClick={()=>{handleRekeying(userData.email)}}

export default Settings