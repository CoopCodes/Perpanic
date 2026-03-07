import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons'
import { SVGFilter, defaultSVGFilterTemplate } from '../components/SVGFilter'
import { getEvents } from '../data/events'

interface GalleryItem {
  image: string
  title: string
  date: Date
  location: string
}

export function GalleryPage() {
  const events = useMemo(() => getEvents(), [])
  const galleryItems = useMemo(() => {
    return events.flatMap((event) =>
      event.images.map((image) => ({
        image,
        title: event.title,
        date: event.date,
        location: event.location,
      }))
    )
  }, [events])

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const showModal = selectedIndex !== null
  const selectedItem = showModal ? galleryItems[selectedIndex!] : null

  const closeModal = useCallback(() => {
    setSelectedIndex(null)
  }, [])

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return 0
      return (prev - 1 + galleryItems.length) % galleryItems.length
    })
  }, [galleryItems.length])

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return 0
      return (prev + 1) % galleryItems.length
    })
  }, [galleryItems.length])

  useEffect(() => {
    if (!showModal) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showModal])

  useEffect(() => {
    if (!showModal) return
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal()
      } else if (event.key === 'ArrowRight') {
        handleNext()
      } else if (event.key === 'ArrowLeft') {
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showModal, closeModal, handleNext, handlePrev])

  const handleImageClick = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  const handleGridKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>, index: number) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setSelectedIndex(index)
      }
    },
    []
  )

  return (
    <>
      <div
        className="absolute inset-0 z-[100] mix-blend-lighten pointer-events-none transition-opacity"
        style={{
          backgroundImage: `url('/foreground-texture-low-res-2.webp')`,
          backgroundSize: '100%',
          backgroundRepeat: 'repeat',
          transform: 'scaleX(-1)',
          opacity: showModal ? 0.3 : 0.5,
        }}
      ></div>
      <div className="main-content relative min-h-screen bg-textured-black">
        <div className="container relative min-h-screen pt-[150px] pb-14 lg:pb-16">
          <div className="mb-6 sm:mb-8">
            <SVGFilter animate={true}>
              <h1 className="h2-sm lg:text-[5.5rem] leading-none">Gallery</h1>
            </SVGFilter>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6 lg:gap-3">
            {galleryItems.map((item, index) => (
              <div
                key={`${item.image}-${index}`}
                className="relative overflow-hidden bg-black group cursor-pointer"
                onClick={() => handleImageClick(index)}
                onKeyDown={(event) => handleGridKeyDown(event, index)}
                role="button"
                tabIndex={0}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover aspect-[4/6]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                    <SVGFilter
                      animate={true}
                      template={{
                        ...defaultSVGFilterTemplate,
                        scale: 1,
                      }}
                    >
                      <h3 className="text-white text-xl sm:text-4xl tracking-[-0.04em] line-clamp-2 mb-1 leading-[100%]">
                        {item.title}
                      </h3>
                      <p className="text-white arial text-sm sm:text-base">
                        {item.date.toLocaleDateString()}
                      </p>
                    </SVGFilter>
                  </div>
                </div>
              </div>
            ))}
            <div className="hidden lg:block lg:col-span-3" aria-hidden="true"></div>
          </div>

          {showModal &&
            selectedItem &&
            createPortal(
              <div
                className="fixed inset-0 z-[20] flex items-end justify-center"
                role="dialog"
                aria-modal="true"
                aria-label="Gallery image viewer"
              >
                <div
                  className="absolute inset-0 bg-black/80"
                  aria-hidden="true"
                  onClick={closeModal}
                />
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute right-6 top-6 z-20 text-2xl text-white hover:text-white focus:outline-none cursor-pointer hover:scale-120"
                  aria-label="Close gallery modal"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                <div className="relative z-10 flex w-full max-w-[1100px] h-[95vh] flex-col items-center justify-center gap-6 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-center lg:gap-12 lg:px-12">
                  <div className="relative max-lg:w-full h-full">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="aspect-[4/6] object-cover h-full max-sm:object-contain max-sm:object-bottom"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-5 lg:w-fit">
                    <div className="flex flex-col gap-1">
                      <SVGFilter animate={true}>
                        <h2 className="h2-sm text-[3rem] leading-[0.9] text-white sm:text-[3.5rem] lg:text-[4rem]">
                          {selectedItem.location}
                        </h2>
                      </SVGFilter>
                      <SVGFilter animate={true} template={{ ...defaultSVGFilterTemplate, scale: 1 }}>
                        <p className="arial text-xl text-white sm:text-[1.25rem]">
                          {selectedItem.date.toLocaleDateString()}
                        </p>
                      </SVGFilter>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="text-white hover:text-white focus:outline-none cursor-pointer hover:scale-130"
                        aria-label="Previous image"
                      >
                        <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
                      </button>
                      <SVGFilter animate={true} template={{ ...defaultSVGFilterTemplate, scale: 1 }}>
                        <span className="arial text-sm text-white">
                          {selectedIndex! + 1} / {galleryItems.length}
                        </span>
                      </SVGFilter>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="text-white hover:text-white focus:outline-none cursor-pointer hover:scale-130"
                        aria-label="Next image"
                      >
                        <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )}
        </div>
      </div>
    </>
  )
}
