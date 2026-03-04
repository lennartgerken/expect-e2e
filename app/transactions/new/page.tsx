'use client'

import ButtonLink from '@/components/button-link'
import FormInput from '@/components/form-input'
import { createTransaction } from '@/lib/actions'
import { useActionState } from 'react'

export default function NewTransaction() {
    const [state, formAction, isPending] = useActionState(createTransaction, {
        formError: null,
        fieldErrors: {},
        success: false,
        finishedAt: null
    })

    return (
        <div>
            <h1>Initialize New Transaction</h1>
            <form className="flex flex-col" action={formAction}>
                <FormInput
                    label="Title"
                    name="title"
                    error={state.fieldErrors.title}
                />
                <div className="flex gap-2">
                    <button disabled={isPending} type="submit">
                        Create Transaction
                    </button>
                    <ButtonLink href="/transactions" title="Cancel" />
                </div>
            </form>
        </div>
    )
}
