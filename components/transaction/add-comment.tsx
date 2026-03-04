'use client'

import { createComment } from '@/lib/actions'
import { useActionState } from 'react'
import FormInput from '../form-input'

export function AddComment({ transactionID }: { transactionID: number }) {
    const createCommentAction = createComment.bind(null, transactionID)
    const [state, formAction, isPending] = useActionState(createCommentAction, {
        formError: null,
        fieldErrors: {},
        success: false,
        finishedAt: null
    })

    return (
        <form action={formAction}>
            {state.formError && (
                <p style={{ color: 'red' }}>{state.formError}</p>
            )}
            <FormInput
                label="New Comment"
                name="comment"
                error={state.fieldErrors.content}
            />
            <button disabled={isPending} type="submit">
                Save Comment
            </button>
        </form>
    )
}
