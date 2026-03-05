'use client'

import { updateTransaction } from '@/lib/actions'
import { useActionState } from 'react'
import FormInput from '../form-input'
import FormRadio from '../form-radio'
import { Data2 } from '@/generated/prisma/enums'

export function Details({
    transactionID,
    data1,
    data2,
    disabled
}: {
    transactionID: number
    data1: string | null
    data2: Data2 | null
    disabled: boolean
}) {
    const updateTransactionAction = updateTransaction.bind(null, transactionID)
    const [state, formAction, isPending] = useActionState(
        updateTransactionAction,
        { formError: null, fieldErrors: {}, success: false, finishedAt: null }
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
                    <FormRadio
                        legend="Data 2"
                        name="data2"
                        options={[
                            { value: Data2.OPTION1, label: 'Option 1' },
                            { value: Data2.OPTION2, label: 'Option 2' },
                            { value: Data2.OPTION3, label: 'Option 3' }
                        ]}
                        defaultValue={data2 ?? undefined}
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
