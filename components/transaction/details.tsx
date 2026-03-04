'use client'

import { updateTransaction } from '@/lib/actions'
import { useActionState } from 'react'
import FormInput from '../form-input'

export function Details({
    transactionID,
    data1,
    disabled
}: {
    transactionID: number
    data1: string | null
    disabled: boolean
}) {
    const updateTransactionAction = updateTransaction.bind(null, transactionID)
    const [state, formAction, isPending] = useActionState(
        updateTransactionAction,
        { formError: null, success: false, finishedAt: null }
    )

    return (
        <div>
            <h2>Transaction Details</h2>
            <form action={formAction}>
                <fieldset disabled={disabled} className="w-full">
                    <FormInput
                        label="Data 1"
                        name="data1"
                        defaultValue={data1 ?? ''}
                    />
                    {state.success && state.finishedAt && (
                        <p style={{ color: 'green' }}>
                            Details updated successfully at{' '}
                            {new Date(state.finishedAt).toLocaleTimeString()}
                        </p>
                    )}
                    {state.formError && (
                        <p style={{ color: 'red' }}>{state.formError}</p>
                    )}
                </fieldset>
                {!disabled && (
                    <button disabled={isPending} type="submit">
                        Save Details
                    </button>
                )}
            </form>
        </div>
    )
}
