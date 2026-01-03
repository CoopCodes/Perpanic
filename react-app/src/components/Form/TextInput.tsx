import type { ChangeEvent, InputHTMLAttributes } from "react";

export interface TextInputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
    label: string;
    value?: string;
    mandatory?: boolean;
    inputClassName?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function TextInput({
    label,
    mandatory = false,
    inputClassName = "w-full md:w-[300px]",
    value = "",
    onChange,
    className,
    id,
    ...rest
}: TextInputProps) {
    const inputId =
        id ??
        (typeof rest.name === "string" ? rest.name : undefined) ??
        label.toLowerCase().replace(/\s+/g, "-");

    const mergedClassName = [
        "border-b-2 bg-none outline-none p1",
        inputClassName,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="flex gap-4">
            <label className="p1 whitespace-nowrap" htmlFor={inputId}>
                {label}
                {mandatory ? "" : ""}
            </label>
            <input
                id={inputId}
                aria-required={mandatory}
                value={value}
                onChange={onChange}
                className={mergedClassName}
                {...rest}
            />
        </div>
    );
}
