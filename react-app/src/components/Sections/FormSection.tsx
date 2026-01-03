import arrow from "../../assets/Arrow.svg";
import { SVGFilter } from "../SVGFilter";
import { TextInput, type TextInputProps } from "../Form/TextInput";
import { DropdownInput, type DropdownInputProps } from "../Form/DropdownInput";
import { LargeTextInput, type LargeTextInputProps } from "../Form/LargeTextInput";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

interface FormValues {
    fullName: string;
    email: string;
    phoneNumber: string;
    company: string;
    website: string;
    reason: string;
    eventName: string;
    eventDateTime: string;
    eventLocation: string;
    audienceSize: string;
    message: string;
}

type TextFieldConfig = {
    kind: "text";
    name: keyof FormValues;
    props: Omit<TextInputProps, "name" | "value" | "onChange">;
};

type DropdownFieldConfig = {
    kind: "dropdown";
    name: keyof FormValues;
    props: Omit<DropdownInputProps, "name" | "value" | "onChange">;
};

type TextAreaFieldConfig = {
    kind: "textarea";
    name: keyof FormValues;
    props: Omit<LargeTextInputProps, "name" | "value" | "onChange">;
};

type FormInputConfig =
    | TextFieldConfig
    | DropdownFieldConfig
    | TextAreaFieldConfig;

interface FormSectionConfig {
    title: string;
    inputs: FormInputConfig[];
}

interface FormConfig {
    title: string;
    sections: FormSectionConfig[];
}

const formConfig: FormConfig = {
    title: "Contact us",
    sections: [
        {
            title: "Contact Details",
            inputs: [
                {
                    kind: "text",
                    name: "fullName",
                    props: { label: "Full Name", mandatory: true },
                },
                {
                    kind: "text",
                    name: "email",
                    props: {
                        label: "Email",
                        mandatory: true,
                        inputClassName: "w-full md:w-[400px]",
                        type: "email",
                        autoComplete: "email",
                    },
                },
                {
                    kind: "text",
                    name: "phoneNumber",
                    props: {
                        label: "Phone Number",
                        mandatory: true,
                        type: "tel",
                        autoComplete: "tel",
                    },
                },
            ],
        },
        {
            title: "Company/Band Details",
            inputs: [
                {
                    kind: "text",
                    name: "company",
                    props: { label: "Company/Band Name" },
                },
                {
                    kind: "text",
                    name: "website",
                    props: {
                        label: "Website or Social Media Link",
                        inputClassName: "w-full md:w-[400px]",
                        autoComplete: "url",
                    },
                },
                {
                    kind: "dropdown",
                    name: "reason",
                    props: {
                        label: "Reason for Contact",
                        mandatory: true,
                        options: [
                            { value: "booking", label: "Booking" },
                            { value: "collaboration", label: "Collaboration" },
                            { value: "inquiry", label: "General Inquiry" },
                            { value: "other", label: "Other" },
                        ],
                    },
                },
            ],
        },
        {
            title: "Event Details",
            inputs: [
                {
                    kind: "text",
                    name: "eventName",
                    props: { label: "Event Name", mandatory: true },
                },
                {
                    kind: "text",
                    name: "eventDateTime",
                    props: {
                        label: "Event Date & Time",
                        type: "datetime-local",
                    },
                },
                {
                    kind: "text",
                    name: "eventLocation",
                    props: { label: "Event Location", mandatory: true },
                },
                {
                    kind: "text",
                    name: "audienceSize",
                    props: { label: "Expected Audience Size", mandatory: true },
                },
            ],
        },
        {
            title: "Message",
            inputs: [
                {
                    kind: "textarea",
                    name: "message",
                    props: { label: "", rows: 8 },
                },
            ],
        },
    ],
};

const initialValues: FormValues = {
    fullName: "",
    email: "",
    phoneNumber: "",
    company: "",
    website: "",
    reason: "",
    eventName: "",
    eventDateTime: "",
    eventLocation: "",
    audienceSize: "",
    message: "",
};

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

const requiredFields: Array<keyof FormValues> = [
    "fullName",
    "email",
    "phoneNumber",
    "reason",
    "eventName",
    "eventLocation",
    "audienceSize",
];

export function FormSection() {
    const [formValues, setFormValues] = useState<FormValues>(initialValues);
    const [status, setStatus] = useState<SubmissionStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleInputChange =
        (field: keyof FormValues) =>
        (
            event:
                | ChangeEvent<HTMLInputElement>
                | ChangeEvent<HTMLTextAreaElement>
                | ChangeEvent<HTMLSelectElement>
        ) => {
            const { value } = event.target;
            setFormValues((prev) => ({ ...prev, [field]: value }));
        };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (status === "submitting") {
            return;
        }

        setStatus("submitting");
        setErrorMessage(null);

        const missingField = requiredFields.find((field) => {
            const currentValue = formValues[field]?.trim?.() ?? "";
            return currentValue.length === 0;
        });

        if (missingField) {
            setStatus("error");
            setErrorMessage("Please fill in all required fields before submitting.");
            return;
        }

        try {
            console.log(formValues);
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                const message =
                    (body && (body.error ?? body.message)) ||
                    "Something went wrong. Please try again later.";
                throw new Error(message);
            }

            setFormValues(() => ({ ...initialValues }));
            setStatus("success");
        } catch (error) {
            setStatus("error");
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again later."
            );
        }
    };

    return (
        <div className="container relative bg-textured-black h-[100vh] py-20">
            <SVGFilter animate={true} className="mx-auto lg:px-6 lg:max-w-[1314px]">
                <h2 className='h2-sm mb-3 md:mb-5'>{formConfig.title}</h2>
                <hr className="mb-3 md:mb-5 border-1 border-gray-100"></hr>
                <form className="flex flex-col gap-10" onSubmit={handleSubmit} noValidate>
                    {formConfig.sections.map((section, index) => (
                        <div key={section.title}>
                            <h3 className="h3">{index + 1}. {section.title}</h3>
                            <div className="flex gap-3 sm:gap-5 mt-3 md:mt-4 flex-wrap">
                                {section.inputs.map((input) => {
                                    if (input.kind === "text") {
                                        return (
                                            <TextInput
                                                key={input.name}
                                                name={input.name}
                                                value={formValues[input.name]}
                                                onChange={handleInputChange(input.name)}
                                                {...input.props}
                                            />
                                        );
                                    }

                                    if (input.kind === "dropdown") {
                                        return (
                                            <DropdownInput
                                                key={input.name}
                                                name={input.name}
                                                value={formValues[input.name]}
                                                onChange={handleInputChange(input.name)}
                                                {...input.props}
                                            />
                                        );
                                    }

                                    return (
                                        <LargeTextInput
                                            key={input.name}
                                            name={input.name}
                                            value={formValues[input.name]}
                                            onChange={handleInputChange(input.name)}
                                            {...input.props}
                                        />
                                    );
                                })}

                                {/* <TextInput label="Company/Band Name" />
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
                                /> */}
                            </div>
                        </div>
                    ))}
                    {/* <div>
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
                    </div> */}
                    {status === "error" && errorMessage && (
                        <p className="p1 text-red-400">{errorMessage}</p>
                    )}
                    {status === "success" && (
                        <p className="p1 text-green-400">
                            Thanks for reaching out! We will get back to you soon.
                        </p>
                    )}
                    <button
                        type="submit"
                        className="flex gap-6 items-center group w-fit bg-transparent border-none outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={status === "submitting"}
                    >
                        <p className="h3 hover:underline text-nowrap">
                            {status === "submitting" ? "Submitting..." : "Submit"}
                        </p>
                        <img src={arrow} className="h-3 transition-all mt-1 group-hover:translate-x-2" alt="arrow" />
                    </button> 
                </form>
            </SVGFilter>
        </div>
    )
}
