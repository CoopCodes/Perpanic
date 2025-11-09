import type { ReactNode, Ref } from 'react'
import { useEffect, useState, useRef } from 'react'
import { useScreenSize, type BreakpointType } from '../hooks/useScreenSize'
import { getValueForBreakpoint, vw } from '../utils/transitionUtils'

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
  scale: 1.5,
}

interface SVGFilterProps {
  children?: ReactNode,
  className?: string,
  ref?: Ref<any>,
  template?: SVGFilterTemplate
  animate?: boolean,
}

export function SVGFilter({ children, className, ref, template = defaultSVGFilterTemplate, animate = false  }: SVGFilterProps) {
  const [currentSeed, setCurrentSeed] = useState(0)
  const filterId = useRef(`filter-${crypto.randomUUID()}`).current
  const { width, sizeCategory } = useScreenSize();

  const calculateScale = () => {
    return Math.max(getValueForBreakpoint(2, 2, 2, sizeCategory as BreakpointType), vw(template.scale, width));
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

    let animationFrameId: number;
    let lastUpdate = Date.now();

    const updateSeed = () => {
      const now = Date.now();
      if (now - lastUpdate >= ANIMATION_INTERVAL) {
        setCurrentSeed(prev => prev >= MAX_SEED ? 0 : prev + 1);
        lastUpdate = now;
      }
      animationFrameId = requestAnimationFrame(updateSeed);
    };

    animationFrameId = requestAnimationFrame(updateSeed);
    return () => cancelAnimationFrame(animationFrameId);
  }, [animate])

  return (
    <>
      <div className={`${filterId} ${className ?? ""}`} style={{ filter: !children ? `url(#${filterId})` : "" }} ref={ref}>
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