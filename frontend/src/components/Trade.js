import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router';
import useAPI from '../Hooks/useAPI';
import { TbRefresh } from 'react-icons/tb'
import { MdOutlineContentCopy } from 'react-icons/md'
import { Modal } from 'flowbite-react';
import { removeAlert } from '../data/users/action';

const Trade = ({ setShow }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userData, transactionData } = useSelector(state => state.users);
    const { handleTrade, fetchBalance } = useAPI();
    useEffect(() => {
        if (userData.privateKey === null) {
            navigate('/')
            setShow(true)
        }
    }, [userData])
    useEffect(() => {
        fetchBalance(userData?.walletAddress)
    }, [])
    const [toWalletAddress, setToWalletAddress] = useState('')
    const [value, setValue] = useState(null)
    // privateKey
    function onChangeTagInput() {
        setToWalletAddress(toWalletAddress.replace(/^(?:(?:0x)[0-9a-fA-F]+|[\w-]+@[\w.-]+)$/, ""));
    }
    const [showModal, setShowModal] = useState(false);
    const handleTradeForward = () => {
        if (toWalletAddress === '' || value === null) {
            window.alert('Please fill all the fields')
        } else if (toWalletAddress === userData?.walletAddress) {
            window.alert('Sender and Receiver Wallet Addresses cannot be same');
            setToWalletAddress('')
            setValue(null)
        }
        else {
            return true;
        }
    }

    return (
        <>
            {transactionData.txnAlert && <div class={`flex top-10 p-4 mb-4 text-sm ${transactionData.txnStatus ? 'text-green-800 rounded-lg bg-green-50 w-1/2 fixed left-[25%]' : 'text-red-800 rounded-lg bg-red-50 w-1/3 fixed left-[33%] '} dark:bg-gray-800 dark:text-blue-400 `} role="alert">
                <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Transaction Successful</span>
                {
                    transactionData.txnStatus ? <div>
                        <span class="font-medium">Transaction Hash</span> :- {transactionData.txnHash}
                    </div> : <div>
                        <span class="font-medium">Transaction Failed</span>
                    </div>
                }
                {!transactionData.txnStatus ?
                    <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-2" aria-label="Close" onClick={() => { dispatch(removeAlert()) }}>
                        <span class="sr-only">Close</span>
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button> :
                    <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700" data-dismiss-target="#alert-3" aria-label="Close" onClick={() => { dispatch(removeAlert()) }}>
                        <span class="sr-only">Close</span>
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                }
            </div>
            }
            <Modal
                show={showModal}
                size="xl"
                onClose={() => { setShowModal(false) }}
            >
                <Modal.Header style={{
                    backgroundColor: "#0E111B",
                }}>
                    <div className='text-2xl text-gray-300'>Your <span className='bg-clip-text text-transparent bg-gradient-to-r from-[#ADE8EA] to-[#1E429F]  font-extrabold'>Meta Wallet</span></div>
                </Modal.Header>
                <Modal.Body style={{
                    backgroundColor: "#0E111B",
                }}>
                    <div className='flex flex-col justify-start items-start mx-4 my-4 text-gray-300 w-fit px-4 rounded-lg space-y-3'>
                        <div className='text-xl flex flex-col justify-start items-start space-y-2'>
                            <div>Wallet Address :</div> <div className='holder h-[48px] w-fit text-[16px] text-left flex justify-center items-center space-x-2 px-2'><div id='walletAddress'>{userData?.walletAddress}{" "}</div><div className='cursor-pointer' onClick={() => {
                                navigator.clipboard.writeText(userData?.walletAddress);
                            }}><MdOutlineContentCopy /></div></div>
                        </div>
                        <div className='text-xl flex flex-col justify-start items-start space-y-2'>
                            <div>
                                Your Balance :
                            </div>
                            <div className='flex flex-row justify-start items-center space-x-3'>
                                <div className='holder h-[48px] w-fit text-[16px] px-2 text-left flex justify-center items-center space-x-2'>
                                    <div>
                                        {userData?.balance}
                                    </div>
                                </div>
                                <button onClick={()=>{fetchBalance(userData?.walletAddress)}} type="button" class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 flex flex-row justify-between items-center scale-75">{"Sync Now "}{" "} <TbRefresh /></button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <div className='main-body h-[80vh]'>
                <div className='flex flex-col justify-center items-center py-20'>
                    <div className='bg-[#0E111B] flex flex-col justify-start items-start px-10 py-5 border-2 border-[#21273a] rounded-lg w-[450px]'>
                        <div className='text-2xl font-semibold flex flex-row justify-between items-center w-full'>
                            <div>
                                Transact
                            </div>
                            <div className='text-sm underline cursor-pointer' onClick={() => { setShowModal(true) }}>
                                View Wallet Details
                            </div>
                        </div>
                        <div className='mt-2 flex flex-col justify-center items-start space-y-2'>
                            <div className='w-full'>
                                <div className='text-gray-400 mb-1'>Sender Wallet Address or Email</div>
                                <input className='ant-input h-[48px] font-[20px] text-left' autoComplete='off' value={toWalletAddress} onChange={(e) => { setToWalletAddress(e.target.value) }} type='text' placeholder='' />
                            </div>
                            <div className='w-full'>
                                <div className='flex flex-row justify-between items-center'>
                                    <div className='text-gray-400 mb-1'>Amount</div>
                                </div>
                                <input className='ant-input h-[96px] text-[35px] text-right' autoComplete='off' value={value} onChange={(e) => { setValue(e.target.value) }} type='text' placeholder='0 ETH' />
                            </div>
                        </div>
                        <button className='mt-3 swapButton' onClick={() => {
                            if (handleTradeForward()) { onChangeTagInput(); handleTrade(userData?.privateKey, toWalletAddress, value); setValue(null); setToWalletAddress('') }
                        }}>
                            Complete Transaction
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Trade