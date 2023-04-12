import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router';
import useAPI from '../Hooks/useAPI';
import { MdOutlineContentCopy } from 'react-icons/md'
import { Modal } from 'flowbite-react';

const Trade = ({ setShow }) => {
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.users);
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
                        <div className='ext-xl flex flex-col justify-start items-start space-y-2'>
                            <div>
                                Your Balance :
                            </div>
                            <div className='holder h-[48px] w-fit text-[16px] px-2 text-left flex justify-center items-center space-x-2'>
                                {userData?.balance}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <div className='main-body h-[80vh]'>
                <div className='flex flex-col justify-center items-center py-10'>
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