import './index.css'
import { useRef, useEffect, useState } from 'react'
import { HomepageHero } from './components/Sections/HomepageHero'
import { MerchSection } from './components/Sections/MerchSection'

export type ScrollDirection = 'up' | 'down'

export const ScrollDirection = {
  Up: 'up' as const,
  Down: 'down' as const
} as const

function App() {
  // Scroll speed tracking state
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection | undefined>();
  const lastScrollTop = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const isFirstScroll = useRef(true);

  // Scroll speed tracking effect
  useEffect(() => {
    function handleScroll() {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const currentTime = Date.now();

      // Skip speed calculation on first scroll event - just initialize values
      if (isFirstScroll.current) {
        lastScrollTop.current = currentScrollTop;
        lastScrollTime.current = currentTime;
        isFirstScroll.current = false;
        return;
      }

      const scrollDistance = Math.abs(currentScrollTop - lastScrollTop.current);
      const timeDifference = currentTime - lastScrollTime.current;
      const speed = timeDifference > 0 ? (scrollDistance / timeDifference) * 1000 : 0;
      setScrollSpeed(speed);

      const direction = currentScrollTop > lastScrollTop.current ? ScrollDirection.Down : ScrollDirection.Up;
      setScrollDirection(direction);

      lastScrollTop.current = currentScrollTop;
      lastScrollTime.current = currentTime;
    }

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const merchItems = Array(8).fill(null).map((_, index) => (
    <img key={index} src="/Merch Image.png" alt={`Merch Item ${index + 1}`} className="w-[300px] sm:w-[480px] h-full object-cover flex-shrink-0" />
  ));

  return (
    <div className="main-content relative">
      <HomepageHero />
      <MerchSection items={merchItems} scrollSpeed={scrollSpeed} scrollDirection={scrollDirection} />
    </div>
  )
}

export default App
