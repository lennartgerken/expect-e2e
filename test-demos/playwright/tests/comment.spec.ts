import { expect } from '@/custom-expect'
import { test } from '@/custom-test'

test.describe('Comment', () => {
    test('create comment', async ({ transactionPage }) => {
        const content = 'This is a comment.'

        await transactionPage.commentsComponent.addComment(content)
        await expect(
            transactionPage.commentsComponent.getComment(0)
        ).toHaveText(content)
    })
})
