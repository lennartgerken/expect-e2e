import { TransactionStatus } from '@/generated/prisma/enums'

export function Status({ status }: { status: TransactionStatus }) {
    let color = 'bg-gray-600'
    let text = status.toString()
    switch (status) {
        case TransactionStatus.IN_PROGRESS:
            color = 'bg-yellow-500'
            text = 'In Progress'
            break
        case TransactionStatus.REVIEW:
            color = 'bg-blue-500'
            text = 'Review'
            break
        case TransactionStatus.COMPLETED:
            color = 'bg-green-500'
            text = 'Completed'
            break
        case TransactionStatus.CANCELLED:
            color = 'bg-red-500'
            text = 'Cancelled'
            break
    }

    return (
        <span className={color + ' text-white px-2 py-1 rounded text-sm'}>
            {text}
        </span>
    )
}
