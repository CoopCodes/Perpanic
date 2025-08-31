import type { EventModel } from '../../models/eventModel'
import { defaultSVGFilterTemplate, SVGFilter } from '../SVGFilter'

interface GallerySectionProps {
    events: EventModel[]
}

export function GallerySection({ events }: GallerySectionProps) {
    
    return (
        <div className="container relative bg-textured-black min-h-[100vh] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 auto-rows-max">
            {events.map((event, index) => (
                <div key={index} className="col-span-1 relative group">
                    <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover" />
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
    )
}