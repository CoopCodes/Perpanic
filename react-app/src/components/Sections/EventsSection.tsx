import type { EventModel } from '../../models/eventModel'
import { defaultSVGFilterTemplate, SVGFilter } from '../SVGFilter'
import arrow from '../../assets/Arrow.svg'
import { useEffect, useState } from 'react'


interface EventsSectionProps {
    events: EventModel[]
}

export function EventsSection({ events }: EventsSectionProps) {
    const [eventIndex, setEventIndex] = useState(0)
    const [fade, setFade] = useState<'in' | 'out'>('in');

    // Fade out, change index, then fade in
    useEffect(() => {
        const interval = setInterval(() => {
            setFade('out');
            setEventIndex((prevIndex) => (prevIndex + 1) % events.length);
            setFade('in');
        }, 4000);
        return () => clearInterval(interval);
    }, [events.length]);


    return (
        <div className="container relative bg-textured-black h-[100vh]">
            <div className="flex flex-col lg:flex-row lg:gap-16.5 w-full lg:max-w-[1120px] mx-auto">
                <img
                    className={`h-[422px] w-[270px] object-cover transition-opacity ease-in-out duration-200 ${fade === 'in' ? 'opacity-100' : 'opacity-0'}`}
                    src={events[eventIndex].images[0]}
                    alt="test"
                />
                <div className='h-fit w-full'>
                    <div className="flex pb-3 border-b-1 items-end mb-6">
                        <SVGFilter animate={true} template={{
                            ...defaultSVGFilterTemplate,
                            scale: 2.5,
                        }}>
                            <h2 className='h3 leading-none'>upcoming events</h2>
                        </SVGFilter>
                        <SVGFilter animate={true} className='mb-3 ml-auto' template={{
                            ...defaultSVGFilterTemplate,
                            scale: 2,
                        }}>
                            <a className="flex gap-4 items-center group w-fit" href="#">
                                <p className="subheading underline">see all</p>
                                <img src={arrow} className="h-3 transition-all mt-1 group-hover:translate-x-2"></img>
                            </a>
                        </SVGFilter>
                    </div>
                    {events.map((event, index) => (
                        <SVGFilter animate={true} className='w-full flex mb-1 items-center' template={{
                            ...defaultSVGFilterTemplate,
                            scale: 2,
                        }}>
                            <h3 className={`p1 uppercase text-lg lg:text-2xl text-nowrap transition-all duration-200 ${eventIndex === index ? 'underline mb-1 text-xl lg:text-[28px] font-bold' : ''}`}>{event.title}</h3>
                            <svg
                                className="mx-4 flex-grow h-px"
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
                        </SVGFilter>
                    ))}
                </div>
            </div>
        </div>
    )
}
