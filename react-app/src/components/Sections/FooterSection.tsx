import { Link } from 'wouter'
import { SVGFilter } from '../SVGFilter'

export function FooterSection() {
    const currentYear = new Date().getFullYear()

    return (
        <div className="container relative bg-textured-black pb-20 pt-[20vh]">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-16">
                <div className="flex flex-col gap-4">
                    <SVGFilter animate={true}>
                        <h2 className="h2-sm text-[4rem] sm:text-[5rem] lg:text-[7rem]">perpanic</h2>
                    </SVGFilter>
                    <div className="flex flex-wrap gap-6 lg:gap-10">
                        <SVGFilter animate={true}>
                            <Link href="/" className="p1 text-[1.5rem] sm:text-[2rem] hover:underline">
                                home
                            </Link>
                        </SVGFilter>
                        <SVGFilter animate={true}>
                            <Link href="/gallery" className="p1 text-[1.5rem] sm:text-[2rem] hover:underline">
                                gallery
                            </Link>
                        </SVGFilter>
                        <SVGFilter animate={true}>
                            <a href="#contact" className="p1 text-[1.5rem] sm:text-[2rem] hover:underline">
                                contact
                            </a>
                        </SVGFilter>
                    </div>
                </div>
                <div className="flex flex-col gap-4 lg:items-end">
                    <SVGFilter animate={true}>
                        <p className="p1 text-[1.5rem] sm:text-[2rem] opacity-90">© {currentYear} perpanic</p>
                    </SVGFilter>
                    <div className="flex gap-6">
                        <SVGFilter animate={true}>
                            <a href="#" className="p1 text-[1.5rem] sm:text-[2rem] hover:underline">
                                instagram
                            </a>
                        </SVGFilter>
                        <SVGFilter animate={true}>
                            <a href="#" className="p1 text-[1.5rem] sm:text-[2rem] hover:underline">
                                spotify
                            </a>
                        </SVGFilter>
                    </div>
                </div>
            </div>
        </div>
    )
}
