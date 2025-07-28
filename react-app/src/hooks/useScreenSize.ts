import { useState, useEffect } from 'react';

// Define breakpoint constants
export const Breakpoint = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XXL: '2xl'
} as const;

export type BreakpointType = typeof Breakpoint[keyof typeof Breakpoint];

// Define breakpoint values
const breakpointValues = {
  [Breakpoint.XS]: 0,
  [Breakpoint.SM]: 640,
  [Breakpoint.MD]: 768,
  [Breakpoint.LG]: 1024,
  [Breakpoint.XL]: 1280,
  [Breakpoint.XXL]: 1536
} as const;

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    sizeCategory: '' as BreakpointType | ''
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Determine size category using constants
      let newCategory: BreakpointType | '' = '';
      if (width < breakpointValues[Breakpoint.SM]) newCategory = Breakpoint.XS;
      else if (width < breakpointValues[Breakpoint.MD]) newCategory = Breakpoint.SM;
      else if (width < breakpointValues[Breakpoint.LG]) newCategory = Breakpoint.MD;
      else if (width < breakpointValues[Breakpoint.XL]) newCategory = Breakpoint.LG;
      else if (width < breakpointValues[Breakpoint.XXL]) newCategory = Breakpoint.XL;
      else newCategory = Breakpoint.XXL;

      setScreenSize(prev => (
        (prev.width !== width || 
         prev.height !== height || 
         prev.sizeCategory !== newCategory)
          ? { width, height, sizeCategory: newCategory }
          : prev
      ));
    };

    // Debounced resize handler
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    // Initial calculation
    handleResize();
    
    // Event listeners
    window.addEventListener('resize', debouncedHandleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    width: screenSize.width,
    height: screenSize.height,
    sizeCategory: screenSize.sizeCategory,
    isMobile: screenSize.width <= breakpointValues[Breakpoint.MD],
    isTablet: screenSize.width > breakpointValues[Breakpoint.MD] && screenSize.width <= breakpointValues[Breakpoint.LG],
    isDesktop: screenSize.width > breakpointValues[Breakpoint.LG]
  };
};