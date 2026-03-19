import { test as baseTest } from '@playwright/test'
import { LoginPage } from '@/pages/login-page'
import { TransactionsPage } from '@/pages/transactions-page'
import { users } from '@users'
import { LogBrowser } from 'set-steps'
import { NewTransactionPage } from '@/pages/new-transaction-page'
import { TransactionPage } from '@/pages/transaction.page'

interface CustomFixtures {
    loginPage: LoginPage
    transactionsPage: TransactionsPage
    newTransactionPage: NewTransactionPage
    transactionPage: TransactionPage
}

interface CustomOptions {
    user: {
        username: string
        password: string
    }
}

export const test = baseTest.extend<CustomFixtures & CustomOptions>({
    user: [users[0], { option: true }],

    browser: async ({ browser }, use) => {
        await use(
            new LogBrowser(browser, {
                logs: {
                    locatorLogs: {
                        click: (name) => `Click '${name}'.`,
                        fill: (name, value) => `Fill '${name}' with '${value}'.`
                    }
                }
            })
        )
    },

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page)
        await loginPage.goto()
        await use(loginPage)
    },
    transactionsPage: async ({ page, loginPage, user }, use) => {
        await loginPage.login(user.username, user.password)
        await use(new TransactionsPage(page))
    },

    newTransactionPage: async ({ page, transactionsPage }, use) => {
        await transactionsPage.newTransactionA.click()
        await use(new NewTransactionPage(page))
    },

    transactionPage: async ({ page, newTransactionPage }, use) => {
        await newTransactionPage.createTransaction('Test Transaction')
        await use(new TransactionPage(page))
    }
})
