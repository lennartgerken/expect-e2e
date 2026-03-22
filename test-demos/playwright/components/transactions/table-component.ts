import { Locator } from '@playwright/test'
import { BaseComponent } from '../base-component'

export class EntryComponent extends BaseComponent {
    readonly idTd: Locator
    readonly titleTd: Locator
    readonly statusDiv: Locator
    readonly viewA: Locator

    constructor(baseLocator: Locator) {
        super(baseLocator)

        this.idTd = baseLocator.getByTestId('id').describe('ID')
        this.titleTd = baseLocator.getByTestId('title').describe('Title')
        this.statusDiv = baseLocator.getByTestId('status').describe('Status')
        this.viewA = baseLocator
            .getByRole('link', { name: 'View' })
            .describe('View')
    }

    async open() {
        await this.viewA.click()
    }
}

export class TableComponent extends BaseComponent {
    getEntry(title: string) {
        return new EntryComponent(
            this.baseLocator
                .getByRole('row')
                .filter({
                    has: this.page()
                        .getByTestId('title')
                        .filter({ hasText: title })
                })
                .describe(`Entry ${title}`)
        )
    }
}
