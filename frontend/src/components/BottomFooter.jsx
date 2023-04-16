import { Footer } from 'flowbite-react'
import React from 'react'
import { BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs'
export const BottomFooter = () => {
    return (
        <Footer container={true} className='footer'>
            <div className="w-full bg-[#192134]">
                <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1 bg-[#192134]">
                    <a href='/'>
                        <img src="./MetaWallet1.svg"
                            alt="MetaWallet Logo"
                            className="w-[140px] cursor-pointer" />
                    </a>
                    <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6 bg-[#192134]">
                        <div>
                            <Footer.Title title="about" />
                            <Footer.LinkGroup col={true}>
                                <Footer.Link href="https://github.com/yathin017/MetaWallet#readme" target='_blank'>
                                    MetaWallet
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Follow us" />
                            <Footer.LinkGroup col={true}>
                                <Footer.Link href="https://github.com/yathin017/MetaWallet">
                                    Github
                                </Footer.Link>
                                {/* <Footer.Link href="#">
                                    Discord
                                </Footer.Link> */}
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Legal" />
                            <Footer.LinkGroup col={true}>
                                <Footer.Link>
                                    <a href='https://docs.google.com/document/u/1/d/e/2PACX-1vS_sxEK2EHnh3Tspgk0-WnsIcgKOb_3H3eGYb7OLSvYw7Ag3ZMLkybZX6JarVG9Jsg0Qy2rBsM-KtXU/pub' target='_blank'>
                                        Privacy Policy
                                    </a>
                                </Footer.Link>
                                <Footer.Link href="#">
                                    <a href='https://docs.google.com/document/d/e/2PACX-1vSz0r1COjkQ87VZ42WG-tqFQDRreeMofUNTHsK0Gsx9eBf44PQTJ3hFEd0aKA_-5UsqiLuZ-7GuaE6D/pub' target='_blank'>
                                        Terms & Conditions
                                    </a>
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright
                        href="/"
                        by="MetaWallet™"
                        year={2023}
                    />
                    <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                        <Footer.Icon
                            href="#"
                            icon={BsFacebook}
                        />
                        <Footer.Icon
                            href="#"
                            icon={BsInstagram}
                        />
                        <Footer.Icon
                            href="#"
                            icon={BsTwitter}
                        />
                        <Footer.Icon
                            href="https://github.com/yathin017/MetaWallet"
                            icon={BsGithub}
                        />
                    </div>
                </div>
            </div>
        </Footer>
    )
}
