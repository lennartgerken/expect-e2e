import { Locator } from '@playwright/test'
import { BaseComponent } from '../base-component'

export class EntryComponent extends BaseComponent {
    readonly idTd: Locator
    readonly titleTd: Locator
    readonly statusTd: Locator
    readonly viewButton: Locator

    constructor(baseLocator: Locator) {
        super(baseLocator)

        this.idTd = baseLocator.getByTestId('id').describe('ID')
        this.titleTd = baseLocator.getByTestId('title').describe('Title')
        this.statusTd = baseLocator.getByTestId('status').describe('Status')
        this.viewButton = baseLocator
            .getByRole('button', { name: 'View' })
            .describe('View')
    }
}

export class TableComponent extends BaseComponent {
    getEntry() {
        return new EntryComponent(
            this.baseLocator.locator('tbody tr').first().describe('First Entry')
        )
    }
}
