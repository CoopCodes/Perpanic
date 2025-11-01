import { SVGFilter, defaultSVGFilterTemplate } from '../SVGFilter'
import { ArrowButton } from '../ArrowButton'
import type { ReactNode } from 'react'

interface MerchSectionProps {
    items?: ReactNode[]
}

export function MerchSection({ items = [] }: MerchSectionProps) {

    return (
        <div className="container relative bg-textured-black top-textured-connector h-[100vh] max-lg:mt-[10.6rem] max-lg:flex max-lg:flex-col lg:py-[13rem]">
            <div className="flex items-center overflow-hidden h-fit w-[100vw] max-lg:w-[110vw] max-lg:ml-[-10vw] max-lg:mt-auto lg:absolute lg:right-1/2 lg:translate-x-[50%] lg:top-1/2 lg:translate-y-[-50%]">
                <div className="ticker-container w-full h-full flex items-center horizontal-textured-connector-lg relative">
                    <div className="ticker-content flex gap-5 sm:gap-10">
                        {items.length > 0 ? (
                            <>
                                {items.map((item, index) => (
                                    <div key={`first-${index}`} className="w-[300px] sm:w-[480px] h-full object-cover flex-shrink-0">
                                        {item}
                                    </div>
                                ))}
                                {items.map((item, index) => (
                                    <div key={`second-${index}`} className="w-[300px] sm:w-[480px] h-full object-cover flex-shrink-0">
                                        {item}
                                    </div>
                                ))}
                            </>
                        ) : <></>}
                    </div>
                </div>
            </div>

            <div className="flex-col gap-1.5 my-auto max-lg:mt-12 lg:absolute lg:top-1/2 lg:translate-y-[-50%] xl:ml-24 z-100 bg-textured max-lg:mb-auto">
                <SVGFilter animate={true}>
                    <h2 className='h2 leading-none'>merch</h2>
                </SVGFilter>
                <ArrowButton title="see the collection" href="#" />
            </div>
        </div>
    )
} 