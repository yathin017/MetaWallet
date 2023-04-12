import React from 'react'
import Features from './Features'
import Newsletter from './Newsletter'

const Landingpage = () => {
    return (
        <>
            <div class="text-center py-12 md:py-16">
                <h1 class="text-5xl md:text-6xl text-gray-300 font-extrabold leading-tighter tracking-tighter mb-4" data-aos="fade-down" data-aos-delay="300">Start using <span class="bg-clip-text text-transparent bg-gradient-to-r from-[#ADE8EA] via-[#1E429F] to-gray-300">Meta Wallet</span> today!</h1>
                <div class="max-w-3xl mx-auto">
                    <p class="text-xl text-gray-200 mb-8" data-aos="fade-left" data-aos-delay="300">Secure and User-Friendly Digital Asset Wallet</p>
                    <p class="text-xl text-gray-200 mb-8 text-justify" data-aos="fade-right" data-aos-delay="300">Digital asset wallets are vulnerable to potential attacks by quantum computers, which can result in significant financial losses and reduced user trust. At Meta Wallet, we prioritize the safety and security of your digital assets. We have conducted extensive research to develop a new algorithm that utilizes post-quantum cryptography and zero-knowledge proof to enhance wallet security.
<br></br>
<br></br>
                        Our approach ensures that your investments remain protected from potential quantum computer attacks, while also being user-friendly. With Meta Wallet, you can enjoy peace of mind, knowing that your digital assets are safe and secure. Try our wallet today and experience the next level of security and convenience.</p>
                </div>
            </div>
            <Features />
            <Newsletter />
        </>
    )
}

export default Landingpage