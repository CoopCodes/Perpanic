import arrow from '../../assets/Arrow.svg'
import { SVGFilter } from "../SVGFilter";
import { TextInput } from "../Form/TextInput";
import { DropdownInput } from "../Form/DropdownInput";
import { LargeTextInput } from "../Form/LargeTextInput";

interface Input {
    label: string,
    mandatory?: boolean,
    inputClassName?: string,
    type?: string,
    options?: { value: string, label: string }[],
    placeholder?: string,
    rows?: number,
}

interface FormSection {
    title: string,
    inputs: Input[],
}

// const form: FormSection[] = [

interface FormSectionProps {

}

export function FormSection({  }: FormSectionProps) {


    return (
        <div className="container relative bg-textured-black h-[100vh] py-20">
            <SVGFilter animate={true} className="mx-auto lg:px-6 lg:max-w-[1314px]">
                <h2 className='h2-sm mb-3 md:mb-5'>Contact us</h2>
                <hr className="mb-3 md:mb-5 border-1 border-gray-100"></hr>
                <form className="flex flex-col gap-10">
                    <div>
                        <h3 className="h3">1. Contact Details</h3>
                        <div className="flex gap-3 sm:gap-5 mt-3 md:mt-4 flex-wrap">
                            <TextInput label="Full Name" mandatory={true} />
                            <TextInput label="Email" mandatory={true} inputClassName="w-full md:w-[400px]" />
                            <TextInput label="Phone Number" mandatory={true} />
                        </div>
                    </div>
                    <div>
                        <h3 className="h3">2. Company/Band Details</h3>
                        <div className="flex gap-3 sm:gap-5 mt-3 md:mt-4 flex-wrap">
                            <TextInput label="Company/Band Name" />
                            <TextInput label="Website or Social Media Link" inputClassName="w-full md:w-[400px]" />
                            <DropdownInput 
                                label="Reason for Contact" 
                                mandatory={true}
                                options={[
                                    { value: "booking", label: "Booking" },
                                    { value: "collaboration", label: "Collaboration" },
                                    { value: "inquiry", label: "General Inquiry" },
                                    { value: "other", label: "Other" }
                                ]}
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="h3">3. Event Details</h3>
                        <div className="flex gap-3 sm:gap-5 mt-3 md:mt-4 flex-wrap">
                            <TextInput label="Event Name" mandatory={true} />
                            <TextInput label="Event Date & Time" type="date" />
                            <TextInput label="Event Location" mandatory={true} />
                            <TextInput label="Expected Audience Size" mandatory={true} />
                        </div>
                    </div>
                    <div>
                        <h3 className="h3">4. Message</h3>
                        <div className="mt-3 md:mt-4">
                            <LargeTextInput label="" rows={8} />
                        </div>
                    </div>
                    <button type="submit" className="flex gap-6 items-center group w-fit bg-transparent border-none outline-none cursor-pointer">
                        <p className="h3 hover:underline text-nowrap">Submit</p>
                        <img src={arrow} className="h-3 transition-all mt-1 group-hover:translate-x-2" alt="arrow" />
                    </button>
                </form>
            </SVGFilter>
        </div>
    )
}
