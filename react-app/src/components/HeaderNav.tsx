import { useState, useEffect } from 'react'
import { Link } from 'wouter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { SVGFilter } from './SVGFilter'
import logo from '../assets/perpanic-logo.svg'

const SCROLL_THRESHOLD = 10

export function HeaderNav() {
    const [visible, setVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            if (currentScrollY < SCROLL_THRESHOLD) {
                setVisible(true)
            } else if (currentScrollY > lastScrollY) {
                setVisible(false)
            } else {
                setVisible(true)
            }
            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [mobileMenuOpen])

    const navLinks = (
        <>
            <SVGFilter animate={true}>
                <Link href="/" className="p1 text-4xl sm:text-[1.5rem] hover:underline" onClick={() => setMobileMenuOpen(false)}>
                    home
                </Link>
            </SVGFilter>
            <SVGFilter animate={true}>
                <Link href="/gallery" className="p1 text-4xl sm:text-[1.5rem] hover:underline" onClick={() => setMobileMenuOpen(false)}>
                    gallery
                </Link>
            </SVGFilter>
            <SVGFilter animate={true}>
                <a href="/#contact" className="p1 text-4xl sm:text-[1.5rem] hover:underline" onClick={() => setMobileMenuOpen(false)}>
                    contact
                </a>
            </SVGFilter>
        </>
    )

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-[150] header-textured transition-transform duration-300 ease-out ${
                    visible && !mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <div className="main-content flex items-start justify-between h-24 lg:h-[7rem] pt-4 lg:pt-5">
                    <SVGFilter animate={true} className="block max-sm:mt-1">
                        <Link href="/">
                            <img
                                src={logo}
                                alt="perpanic"
                                className="h-8 sm:h-10 lg:h-12 w-auto invert"
                            />
                        </Link>
                    </SVGFilter>

                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks}
                    </nav>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden p-2 text-white hover:text-white focus:outline-none cursor-pointer"
                        aria-label="Open menu"
                    >
                        <FontAwesomeIcon icon={faBars} className="text-xl" />
                    </button>
                </div>
            </header>

            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-[160] md:hidden"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Navigation menu"
                >
                    <div
                        className="absolute inset-0 bg-black/80"
                        aria-hidden="true"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-8 header-textured mobile-menu-textured">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute right-6 top-6 p-2 text-white hover:text-white focus:outline-none cursor-pointer"
                            aria-label="Close menu"
                        >
                            <FontAwesomeIcon icon={faXmark} className="h-8 w-8" />
                        </button>
                        <nav className="flex flex-col items-center gap-8">
                            {navLinks}
                        </nav>
                    </div>
                </div>
            )}
        </>
    )
}
