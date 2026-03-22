import ButtonLink from '@/components/button-link'
import { Status } from '@/components/status'
import { requireServerUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Role } from '@/lib/users'

export const dynamic = 'force-dynamic'

function Th({ children }: { children: React.ReactNode }) {
    return (
        <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
            {children}
        </th>
    )
}

function Td({
    testID,
    children
}: {
    testID?: string
    children: React.ReactNode
}) {
    return (
        <td
            data-testid={testID}
            className="border-b border-gray-200 px-4 py-2 text-sm text-gray-700"
        >
            {children}
        </td>
    )
}

export default async function Transactions() {
    const transactions = await prisma.transaction.findMany({
        orderBy: { id: 'desc' }
    })

    const { role } = await requireServerUser()

    return (
        <div>
            <h1>Transactions</h1>
            <div className="mb-4">
                {role !== Role.VIEWER && (
                    <ButtonLink
                        href="/transactions/new"
                        title="New Transaction"
                    />
                )}
            </div>
            <table data-testid="transactions-table" className="w-full">
                <thead>
                    <tr>
                        <Th>ID</Th>
                        <Th>Title</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(({ id, title, status }) => (
                        <tr key={id}>
                            <Td testID="id">{id}</Td>
                            <Td testID="title">{title}</Td>
                            <Td>
                                <Status status={status} />
                            </Td>
                            <Td>
                                <ButtonLink
                                    href={`/transactions/${id}`}
                                    title="View"
                                />
                            </Td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
