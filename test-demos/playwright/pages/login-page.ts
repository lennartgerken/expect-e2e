import { Locator, Page } from '@playwright/test'
import { BasePage } from './base-page'

export class LoginPage extends BasePage {
    readonly usernameInput: Locator
    readonly passwordInput: Locator
    readonly loginButton: Locator

    constructor(page: Page) {
        super(page.getByRole('heading', { name: 'Login' }), 'Login')

        this.usernameInput = this.pageLocator
            .getByLabel('Username')
            .describe('Username')
        this.passwordInput = this.pageLocator
            .getByLabel('Password')
            .describe('Password')
        this.loginButton = this.pageLocator
            .getByRole('button', {
                name: 'Login'
            })
            .describe('Login')
    }

    async goto() {
        await this.page.goto('/login')
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }
}
