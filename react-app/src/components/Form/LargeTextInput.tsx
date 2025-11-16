interface LargeTextInputProps {
    label: string,
    mandatory?: boolean,
    inputClassName?: string,
    rows?: number,
}

export function LargeTextInput({ 
    label, 
    mandatory = false, 
    inputClassName = 'w-full',
    rows = 6
}: LargeTextInputProps) {
    return (
        <div className="flex flex-col gap-4">
            <label className="p1 whitespace-nowrap">{label}{mandatory ? "*" : ''}</label>
            <textarea 
                rows={rows}
                className={`border-2 border-white bg-transparent outline-none p1 text-white p-3 resize-none ${inputClassName}`}
            />
        </div>
    )
}
