import { Locator, Page } from '@playwright/test'
import { TableComponent } from '@/components/transactions/table-component'
import { BasePage } from './base-page'

export class TransactionsPage extends BasePage {
    readonly newTransactionA: Locator
    readonly table: TableComponent

    constructor(page: Page) {
        super(
            page.getByRole('heading', { name: 'Transactions' }),
            'Transactions'
        )

        this.newTransactionA = this.pageLocator
            .getByRole('link', {
                name: 'New Transaction'
            })
            .describe('New Transaction')
        this.table = new TableComponent(
            this.pageLocator.getByTestId('transactions-table').describe('Table')
        )
    }

    async goto() {
        await this.page.goto('/transactions')
    }
}
