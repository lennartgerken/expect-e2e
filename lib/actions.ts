'use server'

import prisma from './prisma'
import { redirect } from 'next/navigation'
import { Role } from './users'
import { revalidatePath } from 'next/cache'
import { Data2, TransactionStatus } from '@/generated/prisma/enums'
import { requireServerUser } from './auth'

export type BaseState = {
    formError: string | null
    success: boolean
    finishedAt: string | null
}
export type CreateTransactionState = BaseState & {
    fieldErrors: {
        title?: string
    }
}

export type UpdateTransactionState = BaseState & {
    fieldErrors: {
        data1?: string
        data2?: string
    }
}

export type CreateCommentState = BaseState & {
    fieldErrors: {
        content?: string
    }
}

export async function createTransaction(
    _prev: CreateTransactionState,
    formData: FormData
): Promise<CreateTransactionState> {
    const userCheckError = (await checkUser([Role.MANAGER, Role.USER])).error
    if (userCheckError) return { ...userCheckError, fieldErrors: {} }

    const title = formData.get('title')
    if (!title)
        return {
            formError: null,
            success: false,
            fieldErrors: { title: 'Title is required' },
            finishedAt: new Date().toISOString()
        }

    if (typeof title !== 'string') {
        return {
            formError: null,
            success: false,
            fieldErrors: { title: 'Title must be a string' },
            finishedAt: new Date().toISOString()
        }
    }

    const transaction = await prisma.transaction.create({
        data: { title }
    })

    redirect('/transactions/' + transaction.id)
}

export async function updateTransaction(
    transactionID: number,
    _prev: UpdateTransactionState,
    formData: FormData
): Promise<UpdateTransactionState> {
    const userCheck = await checkUser([Role.MANAGER, Role.USER])
    if (userCheck.error) return { ...userCheck.error, fieldErrors: {} }
    const transactionIDCheck = checkTransactionID(transactionID)
    if (transactionIDCheck) return { ...transactionIDCheck, fieldErrors: {} }

    const role = userCheck.user.role
    const allowedStatus =
        role === Role.MANAGER
            ? [TransactionStatus.IN_PROGRESS, TransactionStatus.REVIEW]
            : [TransactionStatus.IN_PROGRESS]

    const data1 = formData.get('data1')
    if (data1 != null && typeof data1 !== 'string') {
        return {
            formError: null,
            success: false,
            fieldErrors: { data1: 'Data 1 must be a string' },
            finishedAt: new Date().toISOString()
        }
    }

    const data2Raw = formData.get('data2')
    if (data2Raw != null && !Object.values(Data2).includes(data2Raw as Data2))
        return {
            formError: null,
            success: false,
            fieldErrors: { data2: 'Data 2 must be a valid value' },
            finishedAt: new Date().toISOString()
        }
    const data2 = data2Raw as Data2 | null

    await prisma.transaction.update({
        where: { id: transactionID, status: { in: allowedStatus } },
        data: { data1: data1, data2: data2 }
    })

    revalidatePath('/transactions/' + transactionID)
    return {
        formError: null,
        fieldErrors: {},
        success: true,
        finishedAt: new Date().toISOString()
    }
}

export async function startTransaction(
    transactionID: number
): Promise<BaseState> {
    const userCheckError = (await checkUser([Role.MANAGER, Role.USER])).error
    if (userCheckError) return userCheckError
    const transactionIDCheck = checkTransactionID(transactionID)
    if (transactionIDCheck) return transactionIDCheck

    const transaction = await prisma.transaction.updateMany({
        where: { id: transactionID, status: TransactionStatus.NEW },
        data: { status: TransactionStatus.IN_PROGRESS }
    })

    if (transaction.count === 0)
        return {
            formError:
                'Transaction not found or is not in a valid state to start',
            success: false,
            finishedAt: new Date().toISOString()
        }

    revalidatePath('/transactions/' + transactionID)
    return {
        formError: null,
        success: true,
        finishedAt: new Date().toISOString()
    }
}

export async function cancelTransaction(
    transactionID: number
): Promise<BaseState> {
    const userCheckError = (await checkUser([Role.MANAGER])).error
    if (userCheckError) return userCheckError
    const transactionIDCheck = checkTransactionID(transactionID)
    if (transactionIDCheck) return transactionIDCheck

    const transaction = await prisma.transaction.updateMany({
        where: {
            id: transactionID,
            status: {
                in: [
                    TransactionStatus.NEW,
                    TransactionStatus.IN_PROGRESS,
                    TransactionStatus.REVIEW
                ]
            }
        },
        data: { status: TransactionStatus.CANCELLED }
    })

    if (transaction.count === 0)
        return {
            formError:
                'Transaction not found or is not in a valid state to cancel',
            success: false,
            finishedAt: new Date().toISOString()
        }

    revalidatePath('/transactions/' + transactionID)
    return {
        formError: null,
        success: true,
        finishedAt: new Date().toISOString()
    }
}

export async function requestReview(transactionID: number): Promise<BaseState> {
    const userCheckError = (await checkUser([Role.USER])).error
    if (userCheckError) return userCheckError
    const transactionIDCheck = checkTransactionID(transactionID)
    if (transactionIDCheck) return transactionIDCheck

    const transaction = await prisma.transaction.updateMany({
        where: {
            id: transactionID,
            status: TransactionStatus.IN_PROGRESS
        },
        data: { status: TransactionStatus.REVIEW }
    })

    if (transaction.count === 0)
        return {
            formError:
                'Transaction not found or is not in a valid state to request review',
            success: false,
            finishedAt: new Date().toISOString()
        }

    revalidatePath('/transactions/' + transactionID)
    return {
        formError: null,
        success: true,
        finishedAt: new Date().toISOString()
    }
}

export async function returnTransaction(
    transactionID: number
): Promise<BaseState> {
    const userCheckError = (await checkUser([Role.MANAGER])).error
    if (userCheckError) return userCheckError
    const transactionIDCheck = checkTransactionID(transactionID)
    if (transactionIDCheck) return transactionIDCheck

    const transaction = await prisma.transaction.updateMany({
        where: {
            id: transactionID,
            status: TransactionStatus.REVIEW
        },
        data: { status: TransactionStatus.IN_PROGRESS }
    })

    if (transaction.count === 0)
        return {
            formError:
                'Transaction not found or is not in a valid state to return',
            success: false,
            finishedAt: new Date().toISOString()
        }

    revalidatePath('/transactions/' + transactionID)
    return {
        formError: null,
        success: true,
        finishedAt: new Date().toISOString()
    }
}

export async function completeTransaction(
    transactionID: number
): Promise<BaseState> {
    const userCheckError = (await checkUser([Role.MANAGER])).error
    if (userCheckError) return userCheckError
    const transactionIDCheck = checkTransactionID(transactionID)
    if (transactionIDCheck) return transactionIDCheck

    const transaction = await prisma.transaction.updateMany({
        where: {
            id: transactionID,
            status: {
                in: [TransactionStatus.IN_PROGRESS, TransactionStatus.REVIEW]
            }
        },
        data: { status: TransactionStatus.COMPLETED }
    })

    if (transaction.count === 0)
        return {
            formError:
                'Transaction not found or is not in a valid state to complete',
            success: false,
            finishedAt: new Date().toISOString()
        }

    revalidatePath('/transactions/' + transactionID)
    return {
        formError: null,
        success: true,
        finishedAt: new Date().toISOString()
    }
}

export async function createComment(
    transactionID: number,
    _prev: CreateCommentState,
    formData: FormData
): Promise<CreateCommentState> {
    const userCheckError = (await checkUser([Role.MANAGER, Role.USER])).error
    if (userCheckError) return { ...userCheckError, fieldErrors: {} }
    const transactionIDCheck = checkTransactionID(transactionID)
    if (transactionIDCheck) return { ...transactionIDCheck, fieldErrors: {} }

    const content = formData.get('comment')
    if (!content)
        return {
            formError: null,
            success: false,
            fieldErrors: { content: 'Content is required' },
            finishedAt: new Date().toISOString()
        }

    if (typeof content !== 'string') {
        return {
            formError: null,
            success: false,
            fieldErrors: { content: 'Content must be a string' },
            finishedAt: new Date().toISOString()
        }
    }

    await prisma.comment.create({
        data: {
            content,
            transactionID
        }
    })

    revalidatePath('/transactions/' + transactionID)
    return {
        formError: null,
        fieldErrors: {},
        success: true,
        finishedAt: new Date().toISOString()
    }
}

async function checkUser(roles: Role[]) {
    const user = await requireServerUser()

    if (roles && !roles.includes(user.role)) {
        return {
            error: {
                formError: 'You do not have permission to perform this action',
                success: false,
                finishedAt: new Date().toISOString()
            },
            user: null
        }
    }

    return { error: null, user }
}

function checkTransactionID(transactionID: number) {
    if (!transactionID || Number.isNaN(transactionID))
        return {
            formError: 'Invalid transaction ID',
            success: false,
            finishedAt: new Date().toISOString()
        }
    return null
}
