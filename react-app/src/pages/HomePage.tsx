import { useRef, useEffect, useState, useMemo } from 'react'
import { HomepageHero } from '../components/Sections/HomepageHero'
import { MerchSection } from '../components/Sections/MerchSection'
import { GallerySection } from '../components/Sections/GallerySection'
import { EventsSection } from '../components/Sections/EventsSection'
import { FormSection } from '../components/Sections/FormSection'
import { getEvents } from '../data/events'

export function HomePage() {
  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop
      setScrollTop(currentScrollTop)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const merchItems = useMemo(
    () =>
      Array(8)
        .fill(null)
        .map((_, index) => (
          <img
            key={index}
            src="/Merch Image.png"
            loading="lazy"
            alt={`Merch Item ${index + 1}`}
            className="w-[300px] sm:w-[480px] h-full object-cover flex-shrink-0"
          />
        )),
    []
  )

  const events = useRef(getEvents())

  return (
    <div className="main-content relative">
      <div
        className="absolute inset-0 z-[100] mix-blend-lighten opacity-50 pointer-events-none"
        style={{
          backgroundImage: `url('/foreground-texture-low-res-2.webp')`,
          backgroundSize: '100%',
          backgroundRepeat: 'repeat',
          transform: 'scaleX(-1)',
        }}
      />
      <HomepageHero />
      <MerchSection items={merchItems} />
      <GallerySection events={events.current} />
      <EventsSection events={events.current} />
      <FormSection />
      <div className="h-[100vh] container relative bg-textured-black" />
    </div>
  )
}
