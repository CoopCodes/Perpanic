import { Link } from 'wouter'
import arrow from '../assets/Arrow.svg'
import { SVGFilter, defaultSVGFilterTemplate } from './SVGFilter'

interface ArrowButtonProps {
    title: string
    href: string
    className?: string
}

function isInternalLink(href: string) {
  return href.startsWith('/') && !href.startsWith('//')
}

export function ArrowButton({ title, href, className = '' }: ArrowButtonProps) {
  const content = (
    <>
      <p className="subheading underline text-nowrap">{title}</p>
      <img src={arrow} className="h-3 transition-all mt-1 group-hover:translate-x-2" alt="arrow" />
    </>
  )

  return (
    <SVGFilter animate={true} className={className} template={{
      ...defaultSVGFilterTemplate,
      scale: 1.5
    }}>
      {isInternalLink(href) ? (
        <Link href={href} className="flex gap-4 items-center group w-fit">
          {content}
        </Link>
      ) : (
        <a className="flex gap-4 items-center group w-fit" href={href}>
          {content}
        </a>
      )}
    </SVGFilter>
    )
} 