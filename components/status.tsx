import { TransactionStatus } from '@/generated/prisma/enums'

export function Status({ status }: { status: TransactionStatus }) {
    let color = 'bg-gray-600'
    switch (status) {
        case TransactionStatus.IN_PROGRESS:
            color = 'bg-yellow-500'
            break
        case TransactionStatus.REVIEW:
            color = 'bg-blue-500'
            break
        case TransactionStatus.COMPLETED:
            color = 'bg-green-500'
            break
        case TransactionStatus.CANCELLED:
            color = 'bg-red-500'
            break
    }

    return (
        <span className={color + ' text-white px-2 py-1 rounded text-sm'}>
            {status}
        </span>
    )
}
