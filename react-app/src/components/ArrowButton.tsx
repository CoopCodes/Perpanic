import arrow from '../assets/Arrow.svg'
import { SVGFilter, defaultSVGFilterTemplate } from './SVGFilter'

interface ArrowButtonProps {
    title: string
    href: string
    className?: string
}

export function ArrowButton({ title, href, className = '' }: ArrowButtonProps) {
    return (
        <SVGFilter animate={true} className={className} template={{
            ...defaultSVGFilterTemplate,
            scale: 1.5
        }}>
            <a className="flex gap-4 items-center group w-fit" href={href}>
                <p className="subheading underline text-nowrap">{title}</p>
                <img src={arrow} className="h-3 transition-all mt-1 group-hover:translate-x-2" alt="arrow" />
            </a>
        </SVGFilter>
    )
} 