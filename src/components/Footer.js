import React from "react";
import { Link } from 'react-scroll';

const Footer = () => {
    return (
        <footer className="bg-black">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
                    <div className="px-5 py-2">
                        <div className="text-xl text-white font-bold hover:text-gray-300 cursor-pointer">
                            Smart Parking Solutions
                        </div>
                    </div>
                    <div className="px-5 py-2 cursor-pointer">
                        <Link to="home" smooth={true} duration={500} className="text-white hover:text-gray-300">
                            Home
                        </Link>
                    </div>
                    <div className="px-5 py-2 cursor-pointer">
                        <Link to="services" smooth={true} duration={500} className="text-white hover:text-gray-300">
                            Services
                        </Link>
                    </div>
                    <div className="px-5 py-2 cursor-pointer">
                        <Link to="pricing" smooth={true} duration={500} className="text-white hover:text-gray-300">
                            Pricing
                        </Link>
                    </div>
                    <div className="px-5 py-2 cursor-pointer">
                        <Link to="faq" smooth={true} duration={500} className="text-white hover:text-gray-300">
                            FAQ
                        </Link>
                    </div>
                    <div className="px-5 py-2 cursor-pointer">
                        <Link to="contact" smooth={true} duration={500} className="text-white hover:text-gray-300">
                            Contact Us
                        </Link>
                    </div>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    <div className="col-span-1">
                        <h3 className="text-white text-lg font-medium mb-4">About Us</h3>
                        <p className="text-white mb-4">
                            Smart Parking Solutions is dedicated to transforming urban mobility
                            through efficient and secure parking management. We offer real-time
                            availability, automated allocation, and seamless user experiences.
                        </p>
                    </div>

                    <div className="col-span-1">
                        <h3 className="text-white text-lg font-medium mb-4">Services</h3>
                        <ul className="text-white">
                            <li className="mb-2">Vehicle Registration</li>
                            <li className="mb-2">Parking Allocation</li>
                            <li className="mb-2">Admin Dashboard</li>
                            <li className="mb-2">User Profile Management</li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h3 className="text-white text-lg font-medium mb-4">Social Links</h3>
                        <ul className="text-white">
                            <li className="mb-2">Facebook</li>
                            <li className="mb-2">Instagram</li>
                            <li className="mb-2">LinkedIn</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <p className="text-base text-white">
                        &copy; {new Date().getFullYear()} Smart Parking Solutions. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
