'use client'
import { TransactionStatus } from '@/generated/prisma/enums'
import {
    BaseState,
    cancelTransaction,
    completeTransaction,
    requestReview,
    returnTransaction,
    startTransaction
} from '@/lib/actions'
import { Role } from '@/lib/users'
import { useSession } from 'next-auth/react'
import { useActionState } from 'react'

export default function UpdateStatus({
    transactionID,
    currentStatus
}: {
    currentStatus: TransactionStatus
    transactionID: number
}) {
    const { data: session } = useSession()
    const role = session?.user?.role

    const startTransactionAction = startTransaction.bind(null, transactionID)
    const cancelTransactionAction = cancelTransaction.bind(null, transactionID)
    const requestReviewAction = requestReview.bind(null, transactionID)
    const returnTransactionAction = returnTransaction.bind(null, transactionID)
    const completeTransactionAction = completeTransaction.bind(
        null,
        transactionID
    )

    const baseState: BaseState = {
        success: false,
        formError: null,
        finishedAt: null
    }

    const [startState, startFormAction, isStartPending] = useActionState(
        startTransactionAction,
        { ...baseState }
    )

    const [cancelState, cancelFormAction, isCancelPending] = useActionState(
        cancelTransactionAction,
        { ...baseState }
    )

    const [
        requestReviewState,
        requestReviewFormAction,
        isRequestReviewPending
    ] = useActionState(requestReviewAction, { ...baseState })

    const [returnState, returnFormAction, isReturnPending] = useActionState(
        returnTransactionAction,
        { ...baseState }
    )

    const [completeState, completeFormAction, isCompletePending] =
        useActionState(completeTransactionAction, { ...baseState })

    const canStart = currentStatus === TransactionStatus.NEW
    const canCancel =
        currentStatus !== TransactionStatus.COMPLETED &&
        currentStatus !== TransactionStatus.CANCELLED &&
        role === Role.MANAGER
    const canStartReview =
        currentStatus === TransactionStatus.IN_PROGRESS && role === Role.USER
    const canReturn =
        currentStatus === TransactionStatus.REVIEW && role === Role.MANAGER
    const canComplete =
        (currentStatus === TransactionStatus.IN_PROGRESS ||
            currentStatus === TransactionStatus.REVIEW) &&
        role === Role.MANAGER
    const canDoAnything =
        canStart || canCancel || canStartReview || canReturn || canComplete

    const actions: {
        enabled: boolean
        formAction: () => void
        isPending: boolean
        label: string
    }[] = [
        {
            enabled: canStart,
            formAction: startFormAction,
            isPending: isStartPending,
            label: 'Start'
        },
        {
            enabled: canCancel,
            formAction: cancelFormAction,
            isPending: isCancelPending,
            label: 'Cancel'
        },
        {
            enabled: canStartReview,
            formAction: requestReviewFormAction,
            isPending: isRequestReviewPending,
            label: 'Request Review'
        },
        {
            enabled: canReturn,
            formAction: returnFormAction,
            isPending: isReturnPending,
            label: 'Return'
        },
        {
            enabled: canComplete,
            formAction: completeFormAction,
            isPending: isCompletePending,
            label: 'Complete'
        }
    ]

    const formError = [
        startState.formError,
        cancelState.formError,
        requestReviewState.formError,
        returnState.formError,
        completeState.formError
    ].find(Boolean)

    return (
        <div className="flex flex-col">
            {role !== Role.VIEWER && canDoAnything && (
                <div className="flex gap-2 items-center">
                    <span className="font-bold">Status Actions:</span>
                    {actions.map((action) =>
                        action.enabled ? (
                            <form action={action.formAction} key={action.label}>
                                <button
                                    disabled={action.isPending}
                                    type="submit"
                                >
                                    {action.label}
                                </button>
                            </form>
                        ) : null
                    )}
                </div>
            )}
            {formError && <div className="text-red-500">{formError}</div>}
        </div>
    )
}
