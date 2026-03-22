'use client'
import { useId } from 'react'

export default function FormSelect({
    label,
    name,
    options,
    defaultValue,
    error
}: {
    label: string
    name: string
    options: { value: string; label: string }[]
    defaultValue: string | null
    error?: string
}) {
    const id = useId()
    return (
        <div className="mb-4">
            <label htmlFor={id}>{label}</label>
            <select
                id={id}
                name={name}
                defaultValue={defaultValue ?? ''}
                className="border border-gray-300 rounded p-2 mb-4 w-full disabled:bg-gray-200"
            >
                <option value="">-- Select an option --</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}
