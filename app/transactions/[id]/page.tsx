import ButtonLink from '@/components/button-link'
import { Status } from '@/components/status'
import Comments from '@/components/transaction/comments'
import { Details } from '@/components/transaction/details'
import UpdateStatus from '@/components/transaction/update-status'
import { TransactionStatus } from '@/generated/prisma/client'
import { requireServerUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Role } from '@/lib/users'
import { notFound, redirect } from 'next/navigation'

export default async function Transaction({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { role } = await requireServerUser()

    const { id } = await params
    const idNumber = Number(id)

    if (isNaN(idNumber)) redirect('/transactions')

    const transaction = await prisma.transaction.findUnique({
        where: { id: idNumber }
    })

    if (!transaction) notFound()

    return (
        <div>
            <div className="flex gap-2 items-center mb-4">
                <span className="text-sm text-gray-700">{transaction.id}</span>
                <h1 className="mb-0">{transaction.title}</h1>
                <Status status={transaction.status} />
            </div>
            <div className="mb-4 flex justify-between items-center">
                <ButtonLink href="/transactions" title="Back to Overview" />
                <UpdateStatus
                    transactionID={idNumber}
                    currentStatus={transaction.status}
                />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
                <div className="basis-2/3">
                    <Details
                        transactionID={idNumber}
                        data1={transaction.data1}
                        data2={transaction.data2}
                        data3={transaction.data3}
                        disabled={
                            transaction.status === TransactionStatus.NEW ||
                            transaction.status ===
                                TransactionStatus.CANCELLED ||
                            transaction.status ===
                                TransactionStatus.COMPLETED ||
                            (role === Role.USER &&
                                transaction.status !==
                                    TransactionStatus.IN_PROGRESS) ||
                            role === Role.VIEWER
                        }
                    />
                </div>
                <div className="basis-1/3">
                    <Comments transactionID={idNumber} />
                </div>
            </div>
        </div>
    )
}
