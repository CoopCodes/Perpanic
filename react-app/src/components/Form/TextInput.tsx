interface TextInputProps {
    label: string,
    mandatory?: boolean,
    inputClassName?: string,
    type?: string,
}

export function TextInput({ label, mandatory = false, inputClassName = 'w-full md:w-[300px]', type = 'text' }: TextInputProps) {
    return (
        <div className="flex gap-4">
            <label className="p1 whitespace-nowrap">{label}{mandatory ? "" : ''}</label>
            <input type={type} className={`border-b-2 bg-none outline-none p1 ${inputClassName}`} />
        </div>
    )
}
