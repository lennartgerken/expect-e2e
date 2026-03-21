import { PseudoFixture as Base } from 'pseudo-fixture'
import { LoginPage } from './pages/login-page'
import { TransactionsPage } from './pages/transactions-page'
import { NewTransactionPage } from './pages/new-transaction-page'
import { TransactionPage } from './pages/transaction.page'
import { Browser, BrowserContext, Page } from '@playwright/test'

export type Fixtures = {
    context: BrowserContext
    page: Page
    loginPage: LoginPage
    transactionsPage: TransactionsPage
    newTransactionPage: NewTransactionPage
    transactionPage: TransactionPage
    initLoginPage: LoginPage
    initTransactionsPage: TransactionsPage
    initNewTransactionPage: NewTransactionPage
    initTransactionPage: TransactionPage
    transactionTitle: string
}

export type Options = {
    user: {
        username: string
        password: string
    }
    customTransactionTitle?: string
}

export class PseudoFixture extends Base<Fixtures> {
    constructor(browser: Browser, options: Options) {
        super({
            context: {
                setup: async () => await browser.newContext(),
                teardown: async ({ context }) => await context.close()
            },

            page: {
                setup: async ({ context }) => await context.newPage()
            },

            loginPage: {
                setup: async ({ page }) => new LoginPage(page)
            },

            transactionsPage: {
                setup: async ({ page }) => new TransactionsPage(page)
            },

            newTransactionPage: {
                setup: async ({ page }) => new NewTransactionPage(page)
            },

            transactionPage: {
                setup: async ({ page }) => new TransactionPage(page)
            },

            initLoginPage: {
                setup: async ({ page }) => {
                    const loginPage = new LoginPage(page)
                    await loginPage.goto()
                    await loginPage.waitFor()
                    return loginPage
                }
            },

            initTransactionsPage: {
                setup: async ({ page, initLoginPage }) => {
                    const transactionsPage = new TransactionsPage(page)
                    await initLoginPage.login(
                        options.user.username,
                        options.user.password
                    )
                    await transactionsPage.waitFor()
                    return transactionsPage
                }
            },

            initNewTransactionPage: {
                setup: async ({ page, initTransactionsPage }) => {
                    const newTransactionPage = new NewTransactionPage(page)
                    await initTransactionsPage.newTransactionA.click()
                    await newTransactionPage.waitFor()
                    return newTransactionPage
                }
            },

            initTransactionPage: {
                setup: async ({
                    page,
                    transactionTitle,
                    initNewTransactionPage
                }) => {
                    const transactionPage = new TransactionPage(page)
                    await initNewTransactionPage.createTransaction(
                        transactionTitle
                    )
                    await transactionPage.waitFor()
                    return transactionPage
                }
            },

            transactionTitle: {
                setup: async () =>
                    options.customTransactionTitle ?? crypto.randomUUID()
            }
        })
    }
}
