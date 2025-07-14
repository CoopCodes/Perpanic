import type { ReactNode } from 'react'
import { useEffect, useState, useRef } from 'react'

export interface SVGFilterTemplate {
  type: 'fractalNoise' | 'turbulence'
  baseFrequency: number
  numOctaves: number
  scale: number,
}

const ANIMATION_INTERVAL = 100 // ms
const MAX_SEED = 1000

export const defaultSVGFilterTemplate: SVGFilterTemplate = {
  type: 'fractalNoise',
  baseFrequency: 0.2,
  numOctaves: 6,
  scale: 2.5,
}

interface SVGFilterProps {
  children?: ReactNode,
  className?: string,
  template?: SVGFilterTemplate
  animate?: boolean
}

export function SVGFilter({ children, className, template = defaultSVGFilterTemplate, animate = false }: SVGFilterProps) {
  const [currentSeed, setCurrentSeed] = useState(0)
  const filterId = useRef(`filter-${crypto.randomUUID()}`).current

  useEffect(() => {
    if (!animate) return

    const interval = setInterval(() => {
      setCurrentSeed(prev => prev >= MAX_SEED ? 0 : prev + 1)
    }, ANIMATION_INTERVAL);

    return () => clearInterval(interval)

    // let lastUpdate = 0;
    // const handleMouseMove = () => {
    //   const now = Date.now();
    //   if (now - lastUpdate > 50) {
    //     setCurrentSeed(prev => prev >= MAX_SEED ? 0 : prev + 1);
    //     lastUpdate = now;
    //   }
    // };
    // window.addEventListener("mousemove", handleMouseMove);

    // return () => {
    //   window.removeEventListener("mousemove", handleMouseMove);
    // };

  }, [animate])

  return (
    <>
      <div className={`${filterId} ${className ?? ""}`} style={{ filter: !children ? `url(#${filterId})` : "" }}>
        {children}
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0" width="0">
          <defs>
            <filter
              id={filterId}
              style={{ colorInterpolation: 'sRGB' }}
            >
              <feTurbulence
                baseFrequency={template.baseFrequency}
                numOctaves={template.numOctaves}
                type="fractalNoise"
                result="result"
                seed={animate ? currentSeed : 0}
              />
              <feDisplacementMap
                scale={template.scale}
                result="result5"
                xChannelSelector="R"
                in="SourceGraphic"
                in2="result"
              />
              <feComposite
                in="SourceGraphic"
                operator="atop"
                in2="result5"
                scale="18.4"
              />
            </filter>
          </defs>
        </svg>
        <style>
          {`
            .${filterId} { 
              filter: url(#${filterId}); 
            }
          `}
        </style>
      </div>
    </>
  )
} 