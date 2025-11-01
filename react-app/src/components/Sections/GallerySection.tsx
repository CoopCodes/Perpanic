import type { EventModel } from '../../models/eventModel'
import { ArrowButton } from '../ArrowButton'
import { defaultSVGFilterTemplate, SVGFilter } from '../SVGFilter'

interface GallerySectionProps {
    events: EventModel[]
}

export function GallerySection({ events }: GallerySectionProps) {
    
    return (
        <div className="container relative bg-textured-black h-[100vh] max-h-[100vh] grid grid-cols-1 lg:grid-cols-3 gap-4 py-10 lg:py-20">
            <div className="flex-col gap-1.5 my-auto max-lg:order-last">
                <SVGFilter animate={true}>
                    <h2 className='h2 leading-none'>gallery</h2>
                </SVGFilter>
                <ArrowButton title="see all" href="#" />
            </div>
            <div className="flex flex-wrap overflow-y-hidden gap-4 col-span-2 lg:justify-end max-lg:order-first max-lg:mt-12 max-sm:w-[480px]">
                {events.map((event, index) => (
                    <div key={index} className="relative group h-[calc(50%-1rem)]">
                        <img src={event.images[0]} alt={event.title} className="h-full object-cover aspect-[420/629]" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                                <SVGFilter
                                    animate={true}
                                    template={{
                                    ...defaultSVGFilterTemplate,
                                    scale: 1,
                                }}>
                                    <h3 className="text-white text-xl sm:text-4xl tracking-[-0.04em] line-clamp-2 mb-1 leading-[100%]">{event.title}</h3>
                                    <p className="text-white arial text-sm sm:text-base">{event.date.toLocaleDateString()}</p>
                                </SVGFilter>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}