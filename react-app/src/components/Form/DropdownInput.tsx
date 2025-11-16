interface DropdownInputProps {
    label: string,
    mandatory?: boolean,
    inputClassName?: string,
    options: { value: string, label: string }[],
    placeholder?: string,
}

export function DropdownInput({ 
    label, 
    mandatory = false, 
    inputClassName = 'w-full md:w-[300px]',
    options,
    placeholder = "Select..."
}: DropdownInputProps) {
    return (
        <div className="flex gap-4">
            <label className="p1 whitespace-nowrap">{label}{mandatory ? "*" : ''}</label>
            <select className={`border-b-2 bg-none outline-none p1 appearance-none cursor-pointer text-white ${inputClassName}`}>
                <option value="" className="text-white bg-black">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="text-white bg-black">{option.label}</option>
                ))}
            </select>
        </div>
    )
}
