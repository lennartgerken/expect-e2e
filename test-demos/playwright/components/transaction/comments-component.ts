import { Locator } from '@playwright/test'
import { BaseComponent } from '../base-component'

export class CommentsComponent extends BaseComponent {
    readonly commentInput: Locator
    readonly saveButton: Locator

    constructor(baseLocator: Locator) {
        super(baseLocator)

        this.commentInput = baseLocator
            .getByLabel('New Comment')
            .describe('New Comment')
        this.saveButton = baseLocator
            .getByRole('button', {
                name: 'Save Comment'
            })
            .describe('Save Comment')
    }

    getComment(index: number) {
        return this.locator('li').nth(index).describe(`Comment ${index}`)
    }

    async addComment(content: string) {
        await this.commentInput.fill(content)
        await this.saveButton.click()
    }
}
