import { useId } from 'react'

export default function FormRadio({
    legend,
    name,
    options,
    defaultValue
}: {
    legend: string
    name: string
    options: { value: string; label: string }[]
    defaultValue?: string
}) {
    const id = useId()

    return (
        <fieldset className="mb-4">
            <legend>{legend}</legend>
            {options.map(({ value, label }) => {
                const currentID = `${id}-${value}`
                return (
                    <div className="flex items-center gap-1" key={value}>
                        <input
                            className="w-fit mb-0"
                            type="radio"
                            name={name}
                            value={value}
                            id={currentID}
                            defaultChecked={defaultValue === value}
                        />
                        <label className="mb-0" htmlFor={currentID}>
                            {label}
                        </label>
                    </div>
                )
            })}
        </fieldset>
    )
}
