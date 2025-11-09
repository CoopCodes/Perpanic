import './index.css'
import { useRef, useEffect, useState, useMemo } from 'react'
import { HomepageHero } from './components/Sections/HomepageHero'
import { MerchSection } from './components/Sections/MerchSection'
import { GallerySection } from './components/Sections/GallerySection'
import { EventsSection } from './components/Sections/EventsSection'
import type { EventModel } from './models/eventModel'

function App() {
  const [scrollTop, setScrollTop] = useState(0);

  // Track scroll position for sections that respond to scrollTop
  useEffect(() => {
    function handleScroll() {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setScrollTop(currentScrollTop);
    }

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const merchItems = useMemo(() => Array(8).fill(null).map((_, index) => (
    <img key={index} src="/Merch Image.png" loading='lazy' alt={`Merch Item ${index + 1}`} className="w-[300px] sm:w-[480px] h-full object-cover flex-shrink-0" />
  )), []);

  // Generate 8 random events with random names and dates, using the same images
  const randomEventNames = [
    "Neon Skyline Fest",
    "Echoes at Midnight",
    "Sunset Groove",
    "The Velvet Room",
    "Electric Avenue",
    "Moonlight Sessions",
    "The Underground Beat",
    "Starlit Soirée"
  ];

  function getRandomDate() {
    // Random date between Jan 2024 and Dec 2026
    const start = new Date(2024, 0, 1).getTime();
    const end = new Date(2026, 11, 31).getTime();
    return new Date(start + Math.random() * (end - start));
  }

  const eventImages = [
    ["/gallery-image.png", "/gallery-image-2.png", "/gallery-image-3.png", "/gallery-image-4.png"],
    ["/gallery-image-5.png", "/gallery-image-6.png", "/gallery-image-7.png", "/gallery-image-8.png"],
    ["/gallery-image-9.png", "/gallery-image-10.png", "/gallery-image-11.png"],
    ["/gallery-image.png", "/gallery-image-2.png", "/gallery-image-3.png", "/gallery-image-4.png"],
    ["/gallery-image-5.png", "/gallery-image-6.png", "/gallery-image-7.png", "/gallery-image-8.png"],
    ["/gallery-image-9.png", "/gallery-image-10.png", "/gallery-image-11.png"],
    ["/gallery-image.png", "/gallery-image-2.png", "/gallery-image-3.png", "/gallery-image-4.png"],
    ["/gallery-image-5.png", "/gallery-image-6.png", "/gallery-image-7.png", "/gallery-image-8.png"],
  ];

  const events = useRef<EventModel[]>(Array(8).fill(null).map((_, i) => ({
    title: randomEventNames[i],
    date: getRandomDate(),
    images: eventImages[i]
  })));

  return (
    <div className="main-content relative">
      <div
        className="absolute inset-0 z-[100] mix-blend-lighten opacity-50 pointer-events-none"
        style={{ 
          backgroundImage: `url('/foreground-texture-low-res-2.webp')`,
          backgroundSize: '100%',
          backgroundRepeat: 'repeat',
          transform: 'scaleX(-1)'
        }}>
      </div>
      <HomepageHero />
      <MerchSection items={merchItems} />
      <GallerySection events={events.current}/>
      <EventsSection events={events.current} />
      <div className="h-[100vh] container relative bg-textured-black"></div>
    </div>
  )
}

export default App
