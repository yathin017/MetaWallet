import { Card } from 'flowbite-react'
import React from 'react'
import useAPI from '../Hooks/useAPI';

export const Login = () => {
    const [userdata, setuserdata] = React.useState({
        email: '',
        password1: '',
        password2: '',
        token: ''
    })
    const { handleLogin } = useAPI();
    return (

      
        <Card className='cardlogin'>
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
                        onChange={(e)=>{setuserdata({
                            ...userdata,
                            email: e.target.value
                        })}}
                        className="block w-full px-4 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                        Password 1
                    </label>
                    <input
                        type="password"
                        name="password1"
                        id="password1"
                        onChange={(e)=>{
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
                        Password 2
                    </label>
                    <input
                        type="password"
                        name="password2"
                        id="password2"
                        placeholder=""
                        onChange={(e)=>{
                            setuserdata({
                                ...userdata,
                                password2: e.target.value
                            })
                        }}
                        className="block w-full px-4 py-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline-gray"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200">
                        Token
                    </label>
                    <input
                        type="password"
                        name="password2"
                        id="password2"
                        placeholder=""
                        onChange={(e)=>{
                            setuserdata({
                                ...userdata,
                                password2: e.target.value
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
                        onClick={()=>{
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


        </Card>
    )
}
