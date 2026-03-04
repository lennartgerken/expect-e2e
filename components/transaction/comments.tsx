import prisma from '@/lib/prisma'
import { AddComment } from './add-comment'
import { requireServerUser } from '@/lib/auth'

export default async function Comments({
    transactionID
}: {
    transactionID: number
}) {
    const comments = await prisma.comment.findMany({
        where: { transaction: { id: transactionID } }
    })
    const { role } = await requireServerUser()

    return (
        <div>
            <h2>Comments</h2>
            <ul className="mb-4">
                {comments.map(({ id, content }) => (
                    <li key={id}>{content}</li>
                ))}
                {comments.length === 0 && <li>- No comments yet. -</li>}
            </ul>
            {role !== 'VIEWER' && <AddComment transactionID={transactionID} />}
        </div>
    )
}
