import arrow from '../../assets/Arrow.svg'
import { SVGFilter, defaultSVGFilterTemplate } from '../SVGFilter'
// simport type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

// Event Images, for example { "Vinnies Dive Bar" : ["/gallery-image.png", "/gallery-image.png"], "Good things", ["/gallery-image.png", "/gallery-image.png"] }

interface GallerySectionProps {
    eventImages: { [key: string]: string[] }
    scrollTop?: number
}

export function GallerySection({ eventImages, scrollTop }: GallerySectionProps) {
    const [imageIndex, setImageIndex] = useState<number>(0);
    const [eventIndex, setEventIndex] = useState<number>(0);
    const [progress, setProgress] = useState<{ current: number; total: number; percentage: number }>({
        current: 0,
        total: 0,
        percentage: 0
    });

    console.log(progress)

    const containerRef = useRef<HTMLDivElement>(null);
    const lastImagePartitionRef = useRef<number>(0);

    useEffect(() => {
        const containerRect = containerRef.current?.getBoundingClientRect();

        if (!containerRect || scrollTop === undefined) return;

        const buffer = 500;

        const containerHeight = containerRect.height;
        const viewportHeight = window.innerHeight;

        const effectiveContainerTop = containerRect.top + buffer;

        const scrollableDistance = containerHeight + viewportHeight - (buffer * 2);
        const currentScroll = Math.max(0, viewportHeight - effectiveContainerTop);
        const clampedScroll = Math.min(currentScroll, scrollableDistance);

        const progressPercentage = scrollableDistance > 0 ? (clampedScroll / scrollableDistance) * 100 : 0;

        setProgress({
            current: Math.round(clampedScroll),
            total: Math.round(scrollableDistance),
            percentage: Math.round(progressPercentage * 100) / 100
        });

        const eventPartition = scrollableDistance / Object.values(eventImages).length;
        const currentEventPartition = Math.floor(clampedScroll / eventPartition);

        // Calculate image partitions within the current event partition
        const imagePartitionSize = eventPartition / 8; // 1/8th of event partition
        const scrollWithinEvent = clampedScroll % eventPartition; // How far we've scrolled within current event
        const currentImagePartition = Math.floor(scrollWithinEvent / imagePartitionSize);

        // console.log(Math.round(clampedScroll), Math.round(eventPartition), Math.round(clampedScroll) % Math.round(eventPartition));
        // console.log(Math.round(clampedScroll));

        // Handle event partition changes
        if (
            clampedScroll >= 1 &&
            clampedScroll !== scrollableDistance &&
            currentEventPartition !== eventIndex
        ) {
            setEventIndex(currentEventPartition);
            setImageIndex(0); // Reset image index when changing events
            lastImagePartitionRef.current = 0; // Reset image partition ref
        }

        // Handle image partition changes within the current event
        if (
            clampedScroll >= 1 &&
            clampedScroll !== scrollableDistance &&
            currentImagePartition !== lastImagePartitionRef.current
        ) {
            const eventNames = Object.keys(eventImages);
            const currentEventImages = eventImages[eventNames[eventIndex]] || [];

            if (currentEventImages.length > 0) {
                const newImageIndex = currentImagePartition % currentEventImages.length;
                setImageIndex(newImageIndex);
            }

            lastImagePartitionRef.current = currentImagePartition;
        }

        // Update image and event indices based on scroll progress
        // const newImageIndex = Math.floor(Math.round(clampedScroll) / 100);
        // const eventNames = Object.keys(eventImages);
        // const currentEventImages = eventImages[eventNames[eventIndex]] || [];

        // if (newImageIndex >= currentEventImages.length) {
        //     // Move to next event and reset image index
        //     const nextEventIndex = eventIndex + 1;
        //     if (nextEventIndex < eventNames.length) {
        //         setEventIndex(nextEventIndex);
        //         setImageIndex(0);
        //     } else {
        //         // Stay at the last event and last image if we've reached the end
        //         setImageIndex(currentEventImages.length - 1);
        //     }
        // } else {
        //     // Update image index within current event
        //     setImageIndex(Math.max(0, newImageIndex));
        // }

        // console.log(`Progress: ${Math.round(clampedScroll)}px / ${Math.round(scrollableDistance)}px (${Math.round(progressPercentage * 100) / 100}%)`);
        // console.log(`Event: ${eventIndex}, Image: ${imageIndex}`);
    }, [scrollTop, eventImages, eventIndex, imageIndex])

    return (
        <div className="h-[200vh] lg:h-[100vh] max-lg:pt-[50vh] container relative bg-textured-black" ref={containerRef}>
            <div className="sticky lg:static top-1/2 -translate-y-1/2 lg:translate-y-0 w-full">
                {Object.entries(eventImages).map(([eventName, images], i) => (
                    <div className={`absolute h-[75vh] lg:relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-auto lg:left-auto lg:translate-x-0 lg:translate-y-0 w-full flex flex-col gap-6 sm:gap-12 lg:flex-row lg:gap-40  lg:items-center ${eventIndex !== i ? "hidden" : ""}`}>
                        <div className="h-full lg:ml-auto">
                            {images.map((img, j) => (
                                <img
                                    key={j}
                                    src={img}
                                    className={`h-full object-cover aspect-[4/6] ${imageIndex !== j ? "hidden" : ""}`} />
                            ))}
                        </div>
                        <div className="flex-col gap-1.5 lg:mr-auto">
                            <SVGFilter animate={true} template={{
                                ...defaultSVGFilterTemplate,
                                scale: 2.5,
                            }}>
                                <h2 className='h3 leading-none'>{eventName}</h2>
                            </SVGFilter>
                            <SVGFilter animate={true} template={{
                                ...defaultSVGFilterTemplate,
                                scale: 2,
                            }}>
                                <a className="flex gap-4 items-center group w-fit" href="#">
                                    <p className="subheading underline">gallery</p>
                                    <img src={arrow} className="h-3 transition-all mt-1 group-hover:translate-x-2"></img>
                                </a>
                            </SVGFilter>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}