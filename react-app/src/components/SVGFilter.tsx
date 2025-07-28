import type { ReactNode } from 'react'
import { useEffect, useState, useRef } from 'react'
import { useScreenSize } from '../hooks/useScreenSize'
import { vw } from '../utils/transitionUtils'

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
  scale: 2,
}

interface SVGFilterProps {
  children?: ReactNode,
  className?: string,
  template?: SVGFilterTemplate
  animate?: boolean,
}

export function SVGFilter({ children, className, template = defaultSVGFilterTemplate, animate = false  }: SVGFilterProps) {
  const [currentSeed, setCurrentSeed] = useState(0)
  const filterId = useRef(`filter-${crypto.randomUUID()}`).current
  const { width } = useScreenSize();

  const calculateScale = () => {
    return Math.max(2, vw(template.scale, width));
  }
  
  const [calculatedScale, setCalculatedScale] = useState(() => calculateScale());
  
  useEffect(() => {
    setCalculatedScale(calculateScale());
  }, [template.scale, width]);
  
  useEffect(() => {   
    // console.log(calculatedScale, width)
  }, [calculatedScale, width])

  useEffect(() => {
    if (!animate) return

    const interval = setInterval(() => {
      setCurrentSeed(prev => prev >= MAX_SEED ? 0 : prev + 1)
    }, ANIMATION_INTERVAL);

    return () => clearInterval(interval)
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
                scale={calculatedScale}
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