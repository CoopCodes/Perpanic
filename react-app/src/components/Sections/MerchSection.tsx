import { SVGFilter, defaultSVGFilterTemplate } from '../SVGFilter'
import { ArrowButton } from '../ArrowButton'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ScrollDirection } from '../../App'
import { TICKER_ANIMATION_CONFIG } from '../../constants/animationConfig'
import { useScreenSize } from '../../hooks/useScreenSize'

interface MerchSectionProps {
    items?: ReactNode[]
    scrollSpeed?: number,
    scrollDirection?: ScrollDirection
}

export function MerchSection({ items = [], scrollSpeed = 0, scrollDirection = ScrollDirection.Down }: MerchSectionProps) {
    const tickerRef = useRef<HTMLDivElement>(null);
    const { isMobile } = useScreenSize();

    // Direct transform control state/refs
    const rafIdRef = useRef<number | null>(null);
    const lastTsRef = useRef<number | null>(null);
    const positionPxRef = useRef(0);
    const halfSpanPxRef = useRef(0);
    const directionRef = useRef(scrollDirection === ScrollDirection.Down ? 1 : -1);
    const scrollSpeedRef = useRef(scrollSpeed);
    const isMobileRef = useRef(isMobile);

    // Keep refs in sync with props without restarting RAF
    useEffect(() => {
        directionRef.current = scrollDirection === ScrollDirection.Down ? 1 : -1;
    }, [scrollDirection]);

    useEffect(() => {
        scrollSpeedRef.current = scrollSpeed;
    }, [scrollSpeed]);

    useEffect(() => {
        isMobileRef.current = isMobile;
    }, [isMobile]);

    // Measure the ticker width and compute the half-span (duplicated content)
    useEffect(() => {
        const measure = () => {
            if (!tickerRef.current) return;
            const fullWidth = tickerRef.current.scrollWidth;
            halfSpanPxRef.current = fullWidth / 2;
        };

        // Initial measure after layout
        const id = requestAnimationFrame(measure);

        // Re-measure on resize
        const handleResize = () => requestAnimationFrame(measure);
        window.addEventListener('resize', handleResize);

        // Also observe size changes of the content itself
        const ro = new ResizeObserver(measure);
        if (tickerRef.current) ro.observe(tickerRef.current);

        return () => {
            cancelAnimationFrame(id);
            window.removeEventListener('resize', handleResize);
            ro.disconnect();
        };
    }, [items.length]);

    // RAF loop to update transform based on time and scroll speed
    useEffect(() => {
        const step = (ts: number) => {
            if (!tickerRef.current) {
                rafIdRef.current = requestAnimationFrame(step);
                return;
            }

            if (lastTsRef.current == null) lastTsRef.current = ts;
            const dt = (ts - lastTsRef.current) / 1000; // seconds
            lastTsRef.current = ts;

            const halfSpan = halfSpanPxRef.current;
            if (halfSpan > 0) {
                const basePps = halfSpan / (TICKER_ANIMATION_CONFIG.duration / 1000); // pixels per second to traverse half in duration
                const scrollContribution = scrollSpeedRef.current / TICKER_ANIMATION_CONFIG.speedDivisor;
                const mobileScrollMultiplier = .5; // 50% slower scroll speed contribution on mobile
                // const mobileScrollMultiplier = isMobileRef.current ? 0.5 : 1; // 50% slower scroll speed contribution on mobile

                const scrollMultiplier = 1 + (scrollContribution * mobileScrollMultiplier);
                const signedPps = basePps * scrollMultiplier * directionRef.current;

                positionPxRef.current += signedPps * dt;

                // Wrap into [0, halfSpan)
                let pos = positionPxRef.current % halfSpan;
                if (pos < 0) pos += halfSpan;
                positionPxRef.current = pos;

                tickerRef.current.style.transform = `translate3d(${-pos}px, 0, 0)`;
            }

            rafIdRef.current = requestAnimationFrame(step);
        };

        rafIdRef.current = requestAnimationFrame(step);
        return () => {
            if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
            lastTsRef.current = null;
        };
    }, []);

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
                <SVGFilter animate={true}>
                    <h2 className='h2 leading-none'>merch</h2>
                </SVGFilter>
                <ArrowButton title="see the collection" href="#" />
            </div>
        </div>
    )
} 