import { Page } from '@playwright/test'
import { BasePage } from './base-page'
import { CommentsComponent } from '@/components/transaction/comments-component'

export class TransactionPage extends BasePage {
    readonly commentsComponent: CommentsComponent

    constructor(page: Page) {
        super(
            page.getByRole('heading', { name: 'Transaction Details' }),
            'Transaction'
        )

        this.commentsComponent = new CommentsComponent(
            this.pageLocator.getByTestId('comments').describe('Comments')
        )
    }
}
