import { useId } from 'react'

export default function FormInput({
    label,
    name,
    defaultValue,
    error
}: {
    label: string
    name: string
    defaultValue?: string
    error?: string
}) {
    const id = useId()

    return (
        <div className="mb-4">
            <label htmlFor={id}>{label}</label>
            <input
                className={(error ? 'border-red-500' : '') + ' mb-0'}
                name={name}
                id={id}
                type="text"
                defaultValue={defaultValue}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}
