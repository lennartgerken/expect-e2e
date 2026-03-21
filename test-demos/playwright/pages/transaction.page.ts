import { Locator, Page } from '@playwright/test'
import { BasePage } from './base-page'
import { CommentsComponent } from '@/components/transaction/comments-component'
import { DetailsComponent } from '@/components/transaction/details-component'

export class TransactionPage extends BasePage {
    readonly statusDiv: Locator
    readonly backToOverviewA: Locator
    readonly startButton: Locator
    readonly requestReviewButton: Locator
    readonly cancelButton: Locator
    readonly returnButton: Locator
    readonly completeButton: Locator
    readonly detailsComponent: DetailsComponent
    readonly commentsComponent: CommentsComponent

    constructor(page: Page) {
        super(
            page.getByRole('heading', { name: 'Transaction Details' }),
            'Transaction'
        )
        this.statusDiv = this.pageLocator
            .getByTestId('status')
            .describe('Status')
        this.backToOverviewA = this.pageLocator
            .getByRole('link', { name: 'Back to Overview' })
            .describe('Back to Overview')
        this.startButton = this.pageLocator
            .getByRole('button', { name: 'Start' })
            .describe('Start')
        this.requestReviewButton = this.pageLocator
            .getByRole('button', { name: 'Request Review' })
            .describe('Request Review')
        this.cancelButton = this.pageLocator
            .getByRole('button', { name: 'Cancel' })
            .describe('Cancel')
        this.returnButton = this.pageLocator
            .getByRole('button', { name: 'Return' })
            .describe('Return')
        this.completeButton = this.pageLocator
            .getByRole('button', { name: 'Complete' })
            .describe('Complete')
        this.detailsComponent = new DetailsComponent(
            this.pageLocator
                .getByTestId('transaction-details')
                .describe('Transaction Details')
        )
        this.commentsComponent = new CommentsComponent(
            this.pageLocator.getByTestId('comments').describe('Comments')
        )
    }
}
