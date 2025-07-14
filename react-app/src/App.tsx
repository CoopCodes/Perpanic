import './index.css'
import logo from './assets/perpanic-logo.svg'
import arrowShort from './assets/Arrow Short.svg'
import { useRef, useEffect, useState } from 'react'
import { SVGFilter, defaultSVGFilterTemplate } from './components/SVGFilter'

function App() {
  const linksRef = useRef<HTMLDivElement>(null)
  const [, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseLinkIndex, setMouseLinkIndex] = useState(-1);
  const [mouseDistanceFromLink, setMouseDistanceFromLink] = useState(0);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setMousePosition({ x: e.clientX, y: e.clientY });
      const distanceToLink = getMouseDistanceFromLink(e.clientX, e.clientY);
      setArrowRotation(e.clientX, e.clientY, distanceToLink);
    }
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseLinkIndex]);
  
  const getMouseDistanceFromLink = (mouseX: number, mouseY: number) => {
    const link = (linksRef.current?.children[mouseLinkIndex] as HTMLDivElement)?.getBoundingClientRect();

    if (link) {
      const distance = Math.sqrt(Math.pow(mouseX - link.left, 2) + Math.pow(mouseY - link.top, 2));
      setMouseDistanceFromLink(distance);
      return distance;
    }
    
    return 0;
  }

  const setArrowRotation = (mouseX: number, mouseY: number, distanceToLink: number) => {
    const links = linksRef.current;
    if (!links) return;

    const { top, height } = links.getBoundingClientRect();
    
    const linkHeight = height / links.children.length;

    let newMouseLinkIndex = mouseLinkIndex;

    if (mouseY < top + linkHeight) newMouseLinkIndex = 0;
    else if (mouseY > top + linkHeight && mouseY < top + (linkHeight * 2)) newMouseLinkIndex = 1;
    else if (mouseY > top + (linkHeight * 2)) newMouseLinkIndex = 2;
    else newMouseLinkIndex = -1;

    setMouseLinkIndex(newMouseLinkIndex);

    const arrows = Array.from(links.children).map(child => child.children[0]);
    arrows.map((arrow, index) => {
      const arrowElement = arrow as HTMLImageElement;
      arrowElement.style.opacity = index !== newMouseLinkIndex || distanceToLink < 60 ? "0" : "1";
    });
    
    Array.from(links.children).map((link, index) => {
      const linkElement = (link as HTMLAnchorElement);
      if (newMouseLinkIndex === index) linkElement.classList.add("lg:underline");
      else linkElement.classList.remove("lg:underline");
    });
    
    if (newMouseLinkIndex !== -1) {
      let arrow = (arrows[newMouseLinkIndex] as HTMLDivElement) as HTMLImageElement;
      
      const arrowCenterX = arrow.getBoundingClientRect().left + arrow.getBoundingClientRect().width / 2
      const arrowCenterY = arrow.getBoundingClientRect().top + arrow.getBoundingClientRect().height / 2
      
      const angle = Math.atan2(
        mouseY - arrowCenterY,
        mouseX - arrowCenterX
      ) * (180 / Math.PI)

      if (angle < -100 || angle > 100) 
        arrow.style.rotate = `${angle}deg`;
      else arrow.style.opacity = "0";
    }
  }

  const calcLinkScale = () => {
    return Math.min(Math.max((500 / mouseDistanceFromLink), 2.5), 5);
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
      <div className="container bg-textured-black top-textured-connector h-[100vh]">

      </div>
    </div>
  )
}

export default App
