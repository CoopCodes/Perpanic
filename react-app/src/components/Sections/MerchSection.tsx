import { SVGFilter, defaultSVGFilterTemplate } from '../SVGFilter'
import { ArrowButton } from '../ArrowButton'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ScrollDirection } from '../../App'
import { useTickerAnimation } from '../../hooks'
import { TICKER_ANIMATION_CONFIG } from '../../constants/animationConfig'

interface MerchSectionProps {
    items?: ReactNode[]
    scrollSpeed?: number,
    scrollDirection?: ScrollDirection
}

export function MerchSection({ items = [], scrollSpeed = 0, scrollDirection = ScrollDirection.Down }: MerchSectionProps) {
    const tickerRef = useRef<HTMLDivElement>(null);
    const [animation, setAnimation] = useState<Animation | null>(null);

    // #region section: Initialize the Web Animation API
    
    useEffect(() => {
        if (!tickerRef.current) return;

        try {
            const anim = tickerRef.current.animate(
                TICKER_ANIMATION_CONFIG.keyframes.forward,
                {
                    duration: TICKER_ANIMATION_CONFIG.duration,
                    iterations: TICKER_ANIMATION_CONFIG.iterations,
                    easing: TICKER_ANIMATION_CONFIG.easing
                }
            );

            setAnimation(anim);
        } catch (error) {
            console.error('Failed to create ticker animation:', error);
        }

        return () => {
            if (animation) {
                animation.cancel();
            }
        };
    }, []);

    // #endregion

    useTickerAnimation(animation, scrollSpeed, scrollDirection, {
      lerp: 50,
      easing: TICKER_ANIMATION_CONFIG.easing,
      speedDivisor: 55
    });

    return (
        <div className="container relative bg-textured-black top-textured-connector h-[100vh] max-lg:mt-[10.6rem] max-lg:flex max-lg:flex-col lg:py-[13rem]">
            <div className="flex items-center overflow-hidden h-fit w-[100vw] max-lg:w-[110vw] max-lg:ml-[-10vw] max-lg:mt-auto lg:absolute lg:right-1/2 lg:translate-x-[50%] lg:top-1/2 lg:translate-y-[-50%]">
                <div className="ticker-container w-full h-full flex items-center horizontal-textured-connector-lg relative">
                    <div ref={tickerRef} className="ticker-content flex gap-5 sm:gap-10">
                        {items.length > 0 ? (
                            <>
                                {items.map((item, index) => (
                                    <div key={`first-${index}`} className="w-[300px] sm:w-[480px] h-full object-cover flex-shrink-0">
                                        {item}
                                    </div>
                                ))}
                                {items.map((item, index) => (
                                    <div key={`second-${index}`} className="w-[300px] sm:w-[480px] h-full object-cover flex-shrink-0">
                                        {item}
                                    </div>
                                ))}
                            </>
                        ) : <></>}
                    </div>
                </div>
            </div>

            <div className="flex-col gap-1.5 my-auto max-lg:mt-12 lg:absolute lg:top-1/2 lg:translate-y-[-50%] xl:ml-24 z-100 bg-textured max-lg:mb-auto">
                <SVGFilter animate={true} template={{
                    ...defaultSVGFilterTemplate,
                    scale: 3,
                }}>
                    <h2 className='h2 leading-none'>merch</h2>
                </SVGFilter>
                <ArrowButton title="see the collection" href="#" />
            </div>
        </div>
    )
} 