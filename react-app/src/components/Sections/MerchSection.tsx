import arrow from '../../assets/arrow.svg'
import { SVGFilter, defaultSVGFilterTemplate } from '../SVGFilter'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ScrollDirection } from '../../App'

interface MerchSectionProps {
    className?: string
    items?: ReactNode[]
    scrollSpeed?: number,
    scrollDirection?: ScrollDirection
}

export function MerchSection({ className, items = [], scrollSpeed = 0, scrollDirection = ScrollDirection.Down }: MerchSectionProps) {
    const tickerRef = useRef<HTMLDivElement>(null);
    const [animation, setAnimation] = useState<Animation | null>(null);

    // Initialize the Web Animation API
    useEffect(() => {
        if (!tickerRef.current) return;

        // Create the animation
        const anim = tickerRef.current.animate([
            { transform: 'translateX(0%)' },
            { transform: 'translateX(-50%)' }
        ], {
            duration: 60000, // 60 seconds base duration
            iterations: Infinity,
            easing: 'linear'
        });

        setAnimation(anim);

        // Cleanup function
        return () => {
            if (anim) {
                anim.cancel();
            }
        };
    }, []);

    let playbackRateMultiplier = 1;

    useEffect(() => {
        calcTickerPlayback();
    }, [scrollSpeed, animation]);

    const calcTickerPlayback = () => {
        if (!animation) return;
        
        const speedMultiplier = scrollDirection === ScrollDirection.Down ? 1 + (scrollSpeed / 100) : 1 + (scrollSpeed / 100);
        const clampedMultiplier = speedMultiplier;
        
        playbackRateMultiplier =
            speedMultiplier < 0 ?
                playbackRateMultiplier :
                scrollDirection === ScrollDirection.Down ? 1 : -1;
                
        animation.playbackRate = (Math.abs(clampedMultiplier) < 1 ? 1 : clampedMultiplier) * playbackRateMultiplier;        
    }

    calcTickerPlayback();

    return (
        <div className={`container relative bg-textured-black top-textured-connector h-[100vh] max-lg:mt-[10.6rem] max-lg:flex max-lg:flex-col lg:py-[13rem] mb-[100vh]`}>
            <div className="flex items-center overflow-hidden h-fit w-[100vw] max-lg:w-[110vw] max-lg:ml-[-10vw] max-lg:mt-auto lg:absolute lg:right-1/2 lg:translate-x-[50%]">
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
                <SVGFilter animate={true} template={{
                    ...defaultSVGFilterTemplate,
                    scale: 2.2,
                }}>
                    <a className="flex gap-4 items-center group w-fit" href="#">
                        <p className="subheading underline">see the collection</p>
                        <img src={arrow} className="h-3 transition-all mt-1 group-hover:translate-x-2"></img>
                    </a>
                </SVGFilter>
            </div>
        </div>
    )
} 