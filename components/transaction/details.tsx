'use client'

import { updateTransaction } from '@/lib/actions'
import { useActionState } from 'react'
import FormInput from '../form-input'
import FormRadio from '../form-radio'
import { Data2, Data3 } from '@/generated/prisma/enums'
import FormSelect from '../form-select'

export function Details({
    transactionID,
    data1,
    data2,
    data3,
    disabled
}: {
    transactionID: number
    data1: string | null
    data2: Data2 | null
    data3: Data3 | null
    disabled: boolean
}) {
    const updateTransactionAction = updateTransaction.bind(null, transactionID)
    const [state, formAction, isPending] = useActionState(
        updateTransactionAction,
        { formError: null, fieldErrors: {}, success: false, finishedAt: null }
    )

    const data2Labels = {
        [Data2.OPTION1]: 'Option 1',
        [Data2.OPTION2]: 'Option 2',
        [Data2.OPTION3]: 'Option 3'
    } satisfies Record<Data2, string>

    const data3Labels = {
        [Data3.SELECTION1]: 'Selection 1',
        [Data3.SELECTION2]: 'Selection 2',
        [Data3.SELECTION3]: 'Selection 3'
    } satisfies Record<Data3, string>

    return (
        <div>
            <h2>Transaction Details</h2>
            <form action={formAction}>
                <fieldset disabled={disabled} className="w-full">
                    <FormInput
                        label="Data 1"
                        name="data1"
                        defaultValue={data1 ?? ''}
                        error={state.fieldErrors.data1}
                    />
                    <FormRadio
                        legend="Data 2"
                        name="data2"
                        options={Object.entries(data2Labels).map(
                            ([value, label]) => ({
                                value,
                                label
                            })
                        )}
                        defaultValue={data2 ?? undefined}
                        error={state.fieldErrors.data2}
                    />
                    <FormSelect
                        key={state.finishedAt}
                        label="Data 3"
                        name="data3"
                        options={Object.entries(data3Labels).map(
                            ([value, label]) => ({ value, label })
                        )}
                        defaultValue={data3 ?? ''}
                        error={state.fieldErrors.data3}
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
