import { Locator, Page } from '@playwright/test'

export abstract class BasePage {
    protected page: Page
    protected pageLocator: Locator

    constructor(baseLocator: Locator, name: string) {
        this.page = baseLocator.page()
        this.pageLocator = this.page
            .locator('body')
            .filter({ has: baseLocator })
            .describe(name)
    }

    async waitFor() {
        await this.pageLocator.waitFor()
    }
}
