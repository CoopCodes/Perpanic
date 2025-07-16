import './index.css'
import logo from './assets/perpanic-logo.svg'
import arrowShort from './assets/Arrow Short.svg'
import arrow from './assets/arrow.svg'
import { useRef, useEffect, useState, useCallback } from 'react'
import { SVGFilter, defaultSVGFilterTemplate } from './components/SVGFilter'

function App() {
  const linksRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const [, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseLinkIndex, setMouseLinkIndex] = useState(-1);
  const [mouseDistanceFromLink, setMouseDistanceFromLink] = useState(0);

  const updateMouseInteraction = useCallback((mouseX: number, mouseY: number) => {
    const links = linksRef.current;
    if (!links) return;

    const { top, height } = links.getBoundingClientRect();
    const linkHeight = height / links.children.length;

    // Calculate which link the mouse is over
    let newMouseLinkIndex = -1;
    if (mouseY < top + linkHeight) newMouseLinkIndex = 0;
    else if (mouseY > top + linkHeight && mouseY < top + (linkHeight * 2)) newMouseLinkIndex = 1;
    else if (mouseY > top + (linkHeight * 2)) newMouseLinkIndex = 2;

    // Calculate distance to link
    let distanceToLink = 0;
    if (newMouseLinkIndex !== -1) {
      const link = (links.children[newMouseLinkIndex] as HTMLDivElement)?.getBoundingClientRect();
      if (link) {
        const linkCenterX = link.left + link.width / 2;
        const linkCenterY = link.top + link.height / 2;
        distanceToLink = Math.sqrt(Math.pow(mouseX - linkCenterX, 2) + Math.pow(mouseY - linkCenterY, 2));
      }
    }

    // Batch all DOM updates in one frame
    const arrows = Array.from(links.children).map(child => child.children[0]);
    const linkElements = Array.from(links.children);

    arrows.forEach((arrow, index) => {
      const arrowElement = arrow as HTMLImageElement;
      arrowElement.style.opacity = index !== newMouseLinkIndex || distanceToLink < 100 ? "0" : "1";
    });

    linkElements.forEach((link, index) => {
      const linkElement = (link as HTMLAnchorElement);
      if (newMouseLinkIndex === index) linkElement.classList.add("lg:underline");
      else linkElement.classList.remove("lg:underline");
    });

    // Update arrow rotation if hovering over a link
    if (newMouseLinkIndex !== -1) {
      const arrow = arrows[newMouseLinkIndex] as HTMLImageElement;
      const arrowRect = arrow.getBoundingClientRect();
      const arrowCenterX = arrowRect.left + arrowRect.width / 2;
      const arrowCenterY = arrowRect.top + arrowRect.height / 2;
      
      const angle = Math.atan2(
        mouseY - arrowCenterY,
        mouseX - arrowCenterX
      ) * (180 / Math.PI);

      if (angle < -100 || angle > 100) {
        arrow.style.rotate = `${angle}deg`;
      } else {
        arrow.style.opacity = "0";
      }
    }

    // Update state (this will trigger React re-render)
    setMousePosition({ x: mouseX, y: mouseY });
    setMouseLinkIndex(newMouseLinkIndex);
    setMouseDistanceFromLink(distanceToLink);
  }, [setMousePosition, setMouseLinkIndex, setMouseDistanceFromLink]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Schedule the update for the next frame
      animationFrameRef.current = requestAnimationFrame(() => {
        updateMouseInteraction(e.clientX, e.clientY);
      });
    }
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateMouseInteraction]);
  
  const calcLinkScale = () => {
    return Math.min(Math.max((800 / (mouseDistanceFromLink - 80)), 2.5), 100);
  }

  return (
    <div className="main-content relative">
      {/* <SVGFilter animate={true} className="bg-cover bg-center fixed inset-0 h-[100vh] z-[1000] mix-blend-lighten opacity-50 pointer-events-none bg-[url('./assets/foreground-texture.jpg')]"></SVGFilter> */}
      <div
         className="absolute inset-0 z-[1000] mix-blend-lighten opacity-50 pointer-events-none"
         style={{ 
           backgroundImage: `url('/foreground-texture.jpg')`,
           backgroundSize: '50% 50%',
           backgroundRepeat: 'repeat',
           transform: 'scaleX(-1)'
         }}>
      </div>
      <div className={`bg-[url('/hero-image.jpg')] bg-cover bg-center absolute left-0 right-0 top-0 h-[100vh] z-0`}></div>
      <div className="container relative z-1 max-lg:h-[80vh] lg:h-[100vh] flex !max-w-[1820px]">
        <div className="max-lg:mt-auto w-full flex flex-col gap-[38px] md:gap-[160px] md:items-center lg:grid lg:grid-cols-2">
          <img src={logo} alt="logo" className="hero-logo w-[80%] min-w-[245px] h-auto invert drop-shadow-[0px_0px_160.1px_rgba(255,0,0,0.9)] lg:min-w-[450px]"/>
          <div ref={linksRef} className="flex flex-col justify-end gap-8 md:flex-row lg:flex-col md:gap-16 lg:gap-24 w-fit justify-self-end">
            <SVGFilter animate={true} className="flex gap-2" template={mouseLinkIndex === 0 ? {
              ...defaultSVGFilterTemplate,
              scale: calcLinkScale(),
            } : defaultSVGFilterTemplate}>
              <img src={arrowShort} className="origin-left translate-x-full mt-3 transition-opacity max-lg:hidden"></img>
              <a href="#" className="large-link w-fit">merch</a>
            </SVGFilter>
            <SVGFilter animate={true} className="flex gap-2" template={mouseLinkIndex === 1 ? {
              ...defaultSVGFilterTemplate,
              scale: calcLinkScale(),
            } : defaultSVGFilterTemplate}>
              <img src={arrowShort} className="origin-left translate-x-full mt-3 transition-opacity max-lg:hidden"></img>
              <a href="#" className="large-link w-fit">spotify</a>
            </SVGFilter>
            <SVGFilter animate={true} className="flex gap-2" template={mouseLinkIndex === 2 ? {
              ...defaultSVGFilterTemplate,
              scale: calcLinkScale(),
            } : defaultSVGFilterTemplate}>
              <img src={arrowShort} className="origin-left translate-x-full mt-3 transition-opacity max-lg:hidden"></img>
              <a href="#" className="large-link w-fit">events</a>
            </SVGFilter>
          </div>
        </div>
      </div>
      <div className="container bg-textured-black top-textured-connector h-[100vh] max-lg:mt-[10.6rem] py-[17.8125rem] relative">
        <div className="flex-col gap-1.5 my-auto absolute top-1/2 translate-y-[-50%] lg:ml-24">
          <SVGFilter animate={true}>
            <h2 className='h2'>merch</h2>
          </SVGFilter>
          <SVGFilter animate={true} template={{
            ...defaultSVGFilterTemplate,
            scale: 2.2,
          }}>
            <a className="flex gap-4 items-center group" href="#">
                <p className="subheading underline">see the collection</p>
                <img src={arrow} className="h-3 transition-all mt-1 group-hover:translate-x-2"></img>
            </a>
          </SVGFilter>
        </div>
      </div>
    </div>
  )
}

export default App
