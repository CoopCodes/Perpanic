import type { ChangeEvent, SelectHTMLAttributes } from "react";

export interface DropdownInputProps
    extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> {
    label: string;
    value?: string;
    mandatory?: boolean;
    inputClassName?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
    onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function DropdownInput({
    label,
    value = "",
    mandatory = false,
    inputClassName = "w-full md:w-[300px]",
    options,
    placeholder = "Select...",
    onChange,
    className,
    id,
    ...rest
}: DropdownInputProps) {
    const selectId =
        id ??
        (typeof rest.name === "string" ? rest.name : undefined) ??
        label.toLowerCase().replace(/\s+/g, "-");

    const mergedClassName = [
        "border-b-2 bg-none outline-none p1 appearance-none cursor-pointer text-white",
        inputClassName,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="flex gap-4">
            <label className="p1 whitespace-nowrap" htmlFor={selectId}>
                {label}
                {mandatory ? "" : ""}
            </label>
            <select
                id={selectId}
                aria-required={mandatory}
                value={value}
                onChange={onChange}
                className={mergedClassName}
                {...rest}
            >
                <option value="" className="text-white bg-black">
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        className="text-white bg-black"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
