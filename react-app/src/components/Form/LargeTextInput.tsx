import type {
    ChangeEvent,
    TextareaHTMLAttributes,
} from "react";

export interface LargeTextInputProps
    extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> {
    label: string;
    value?: string;
    mandatory?: boolean;
    inputClassName?: string;
    rows?: number;
    onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function LargeTextInput({
    label,
    mandatory = false,
    inputClassName = "w-full",
    rows = 6,
    value = "",
    onChange,
    className,
    id,
    ...rest
}: LargeTextInputProps) {
    const textareaId =
        id ??
        (typeof rest.name === "string" ? rest.name : undefined) ??
        (label ? label.toLowerCase().replace(/\s+/g, "-") : "message");

    const mergedClassName = [
        "border-2 border-white bg-transparent outline-none p1 text-white p-3 resize-none",
        inputClassName,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="flex flex-col gap-4 w-full">
            {label && (
                <label className="p1 whitespace-nowrap" htmlFor={textareaId}>
                    {label}
                    {mandatory ? "" : ""}
                </label>
            )}
            <textarea
                id={textareaId}
                rows={rows}
                aria-required={mandatory}
                value={value}
                onChange={onChange}
                className={mergedClassName}
                {...rest}
            />
        </div>
    );
}
