import { Locator, Page } from '@playwright/test'
import { BasePage } from './base-page'

export class NewTransactionPage extends BasePage {
    readonly titleInput: Locator
    readonly createButton: Locator

    constructor(page: Page) {
        super(
            page.getByRole('heading', { name: 'Initialize New Transaction' }),
            'New Transaction'
        )

        this.titleInput = this.pageLocator.getByLabel('Title').describe('Title')
        this.createButton = this.pageLocator
            .getByRole('button', { name: 'Create Transaction' })
            .describe('Create')
    }

    async goto() {
        await this.page.goto('/transactions/new')
    }

    async createTransaction(title: string) {
        await this.titleInput.fill(title)
        await this.createButton.click()
    }
}
