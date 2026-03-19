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

        this.titleInput = page.getByLabel('Title').describe('Title')
        this.createButton = page
            .getByRole('button', { name: 'Create Transaction' })
            .describe('Create')
    }

    async createTransaction(title: string) {
        await this.titleInput.fill(title)
        await this.createButton.click()
    }
}
