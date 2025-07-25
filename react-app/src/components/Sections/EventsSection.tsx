import type { EventModel } from '../../models/eventModel'
import { defaultSVGFilterTemplate, SVGFilter } from '../SVGFilter'
import arrow from '../../assets/Arrow.svg'
import { useEffect, useState, useRef } from 'react'

interface EventsSectionProps {
    events: EventModel[]
}

export function EventsSection({ events }: EventsSectionProps) {
    const [eventIndex, setEventIndex] = useState(0)
    const [fade, setFade] = useState<'in' | 'out'>('in');
    const [paused, setPaused] = useState(false);
    const intervalRef = useRef<number | null>(null);

    // Fade out, change index, then fade in
    useEffect(() => {
        if (paused) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }
        intervalRef.current = window.setInterval(() => {
            setFade('out');
            setTimeout(() => {
                setEventIndex((prevIndex) => (prevIndex + 1) % events.length);
                setFade('in');
            }, 100);
        }, 4000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [events.length, paused]);

    // Clean up interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleMouseEnter = (index: number) => {
        setPaused(true);
        setFade('out');
        setTimeout(() => {
            setEventIndex(index);
            setFade('in');
        }, 100);
    };

    const handleMouseLeave = () => {
        setPaused(false);
    };

    return (
        <div className="container relative bg-textured-black h-[100vh]">
            <div className="flex flex-col lg:flex-row lg:gap-16.5 w-full lg:max-w-[1120px] mx-auto">
                <img
                    className={`h-[422px] w-[270px] object-cover transition-opacity ease-in-out duration-200 ${fade === 'in' ? 'opacity-100' : 'opacity-0'}`}
                    src={events[eventIndex].images[2]}
                    alt="test"
                />
                <div className='h-fit w-full max-lg:mt-6'>
                    <div className="flex pb-3 border-b-1 items-end mb-6 max-md:flex-col max-md:items-start">
                        <SVGFilter animate={true} template={{
                            ...defaultSVGFilterTemplate,
                            scale: 2.5,
                        }}>
                            <h2 className='h2 lg:text-[5.25rem] leading-[90%] mb-1 mr-5'>upcoming events</h2>
                        </SVGFilter>
                        <SVGFilter animate={true} className='mb-3 md:ml-auto max-md:mt-3' template={{
                            ...defaultSVGFilterTemplate,
                            scale: 2,
                        }}>
                            <a className="flex gap-4 items-center group w-fit" href="#">
                                <p className="subheading underline text-nowrap">see all</p>
                                <img src={arrow} className="h-3 transition-all mt-1 group-hover:translate-x-2"></img>
                            </a>
                        </SVGFilter>
                    </div>
                    {events.map((event, index) => (
                        <SVGFilter
                            animate={true}
                            className={`w-full flex mb-1 items-center ${eventIndex === index ? 'opacity-100' : 'opacity-90'}`}
                            template={{
                                ...defaultSVGFilterTemplate,
                                scale: 2,
                            }}
                            key={event.title + index}
                        >
                            <div
                                className="flex w-full items-center cursor-pointer"
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <h3 className={`p1 uppercase text-lg lg:text-2xl text-nowrap transition-all sm:w-fit duration-200 text-ellipsis max-sm:overflow-hidden max-sm:min-w-[160px] ${eventIndex === index ? 'underline mb-1 text-xl lg:text-[28px] font-[600]' : ''}`}>{event.title}</h3>
                                <svg
                                    className="mx-4 flex-grow w-full h-px max-sm:min-w-[10px]"
                                    preserveAspectRatio="none"
                                    viewBox="0 0 100 1"
                                >
                                    <line
                                        x1="0"
                                        y1="0.5"
                                        x2="100"
                                        y2="0.5"
                                        stroke="white"
                                        strokeWidth="1"
                                        strokeDasharray="1,1.8"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <p className='p1 text-lg lg:text-2xl ml-auto'>{event.date.toLocaleDateString()}</p>
                            </div>
                        </SVGFilter>
                    ))}
                </div>
            </div>
        </div>
    )
}
