import { Avatar, Button, Card, Dropdown, Modal, Navbar } from 'flowbite-react'
import React from 'react'
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
                    <Login />
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
            <div className='bg-transparent'>
                <Navbar
                    fluid={true}
                    rounded={true}
                    className="bg-transparent pt-4 nav"
                >
                    <Navbar.Brand href="https://flowbite.com/">
                        <img
                            src="https://flowbite.com/docs/images/logo.svg"
                            className="mr-3 h-6 sm:h-9"
                            alt="Flowbite Logo"
                        />
                        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                            Meta Wallet
                        </span>
                    </Navbar.Brand>
                    <div className="flex md:order-2">
                        <Button className='bg-[#286cfb] mr-2' size='sm' pill={true} onClick={() => { setShow(true) }}>
                            Login
                        </Button>
                        <Button color="gray" className='' pill={true} size='sm' outline={true} onClick={() => { setShowsignup(true) }}>
                            Sign up
                        </Button>

                        {/* After Login */}
                        {/* <Dropdown
                        arrowIcon={false}
                        inline={true}
                        label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded={true} />}
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">
                                Bonnie Green
                            </span>
                            <span className="block truncate text-sm font-medium">
                                name@flowbite.com
                            </span>
                        </Dropdown.Header>
                        <Dropdown.Item>
                            Dashboard
                        </Dropdown.Item>
                        <Dropdown.Item>
                            Settings
                        </Dropdown.Item>
                        <Dropdown.Item>
                            Earnings
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item>
                            Sign out
                        </Dropdown.Item>
                    </Dropdown> */}

                        <Navbar.Toggle />
                    </div>
                    <Navbar.Collapse>
                        <Navbar.Link
                            href=""
                            active={true}
                        >
                            Home
                        </Navbar.Link>
                        <Navbar.Link href="">
                            Explore
                        </Navbar.Link>
                        <Navbar.Link href="">
                            Contact
                        </Navbar.Link>
                    </Navbar.Collapse>
                </Navbar>

            </div>
        </>
    )
}
