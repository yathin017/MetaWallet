import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router';

const Trade = ({setShow}) => {
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.users);
    useEffect(() => {
        if (userData.privateKey === null) {
            navigate('/')
            setShow(true)
        }
    }, [userData])

    return (
        <div className='main-body'>
            <div className='flex flex-col justify-center items-center py-6 h-[80vh]'>
                <div className='bg-[#0E111B] flex flex-col justify-start items-start px-10 py-5 border-2 border-[#21273a] rounded-lg w-[450px]'>
                    <div className='text-2xl font-semibold'>
                        Transact
                    </div>
                    <div className='mt-3'>
                        <input className='ant-input' autoComplete='off' type='text' placeholder='0' />
                    </div>
                    <div className='mt-3 swapButton'>
                        Complete Transaction
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Trade