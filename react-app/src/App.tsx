import './index.css'
import { useRef, useEffect, useState } from 'react'
import { HomepageHero } from './components/Sections/HomepageHero'
import { MerchSection } from './components/Sections/MerchSection'
import { GallerySection } from './components/Sections/GallerySection'

export type ScrollDirection = 'up' | 'down'

export const ScrollDirection = {
  Up: 'up' as const,
  Down: 'down' as const
} as const

function App() {
  // Scroll speed tracking state
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection | undefined>();
  const [scrollTop, setScrollTop] = useState(0);
  const lastScrollTop = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const isFirstScroll = useRef(0);

  // Scroll speed tracking effect
  useEffect(() => {
    function handleScroll() {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const currentTime = Date.now();

      // Skip speed calculation on first scroll event - just initialize values
      if (isFirstScroll.current < 4) {
        lastScrollTop.current = currentScrollTop;
        lastScrollTime.current = currentTime;
        isFirstScroll.current++;
        return;
      }

      const scrollDistance = Math.abs(currentScrollTop - lastScrollTop.current);
      const timeDifference = currentTime - lastScrollTime.current;
      const speed = timeDifference > 0 ? (scrollDistance / timeDifference) * 1000 : 0;
      setScrollSpeed(speed);

      const direction = currentScrollTop > lastScrollTop.current ? ScrollDirection.Down : ScrollDirection.Up;
      setScrollDirection(direction);
      setScrollTop(currentScrollTop);

      lastScrollTop.current = currentScrollTop;
      lastScrollTime.current = currentTime;
    }

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const merchItems = Array(8).fill(null).map((_, index) => (
    <img key={index} src="/Merch Image.png" loading='lazy' alt={`Merch Item ${index + 1}`} className="w-[300px] sm:w-[480px] h-full object-cover flex-shrink-0" />
  ));

  const eventImages = {
    "Vinnies dive bar": [
      "/gallery-image.png",
      "/gallery-image-2.png",
      "/gallery-image-3.png",
      "/gallery-image-4.png"
    ],
    "Good things": [
      "/gallery-image-5.png",
      "/gallery-image-6.png",
      "/gallery-image-7.png",
      "/gallery-image-8.png"
    ],
    "Woolloongabba": [
      "/gallery-image-9.png",
      "/gallery-image-10.png",
      "/gallery-image-11.png"
    ]
  };

  return (
    <div className="main-content relative">
      <div
        className="absolute inset-0 z-[100] mix-blend-lighten opacity-50 pointer-events-none"
        style={{ 
          backgroundImage: `url('/foreground-texture-low-res.jpg')`,
          backgroundSize: '100%',
          backgroundRepeat: 'repeat',
          transform: 'scaleX(-1)'
        }}>
      </div>
      <HomepageHero />
      <MerchSection items={merchItems} scrollSpeed={scrollSpeed} scrollDirection={scrollDirection} />
      <GallerySection eventImages={eventImages} scrollTop={scrollTop} />
      <div className="h-[100vh] container relative bg-textured-black"></div>
    </div>
  )
}

export default App
