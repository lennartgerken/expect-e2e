import { test as baseTest } from '@playwright/test'
import { LoginPage } from '@/pages/login-page'
import { TransactionsPage } from '@/pages/transactions-page'
import { users } from '@/users'
import { LogBrowser } from 'set-steps'
import { NewTransactionPage } from '@/pages/new-transaction-page'
import { TransactionPage } from '@/pages/transaction.page'
import {
    Fixtures as PseudoFixtures,
    Options as PseudoFixtureOptions,
    PseudoFixture
} from './custom-pseudo-fixture'

type CustomFixtures = {
    loginPage: LoginPage
    transactionsPage: TransactionsPage
    newTransactionPage: NewTransactionPage
    transactionPage: TransactionPage
    initLoginPage: LoginPage
    initTransactionsPage: TransactionsPage
    initNewTransactionPage: NewTransactionPage
    initTransactionPage: TransactionPage
    transactionTitle: string
    runPseudoFixture: <T>(
        callback: (fixtures: PseudoFixtures) => Promise<T>,
        options?: PseudoFixtureOptions
    ) => Promise<T>
}

type CustomOptions = {
    user: {
        username: string
        password: string
    }
    customTransactionTitle?: string
    useExistingTransaction: boolean
}

export const test = baseTest.extend<CustomFixtures & CustomOptions>({
    user: [users.user, { option: true }],
    customTransactionTitle: [undefined, { option: true }],
    useExistingTransaction: [false, { option: true }],

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
        await use(new LoginPage(page))
    },

    transactionsPage: async ({ page }, use) => {
        await use(new TransactionsPage(page))
    },

    newTransactionPage: async ({ page }, use) => {
        await use(new NewTransactionPage(page))
    },

    transactionPage: async ({ page }, use) => {
        await use(new TransactionPage(page))
    },

    initLoginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page)
        await loginPage.goto()
        await loginPage.waitFor()
        await use(loginPage)
    },
    initTransactionsPage: async ({ page, initLoginPage, user }, use) => {
        const transactionsPage = new TransactionsPage(page)
        await initLoginPage.login(user.username, user.password)
        await transactionsPage.waitFor()
        await use(transactionsPage)
    },

    initNewTransactionPage: async ({ page, initTransactionsPage }, use) => {
        const newTransactionPage = new NewTransactionPage(page)
        await initTransactionsPage.newTransactionA.click()
        await newTransactionPage.waitFor()
        await use(newTransactionPage)
    },

    initTransactionPage: async (
        {
            page,
            transactionTitle,
            useExistingTransaction,
            initTransactionsPage,
            newTransactionPage
        },
        use
    ) => {
        const transactionPage = new TransactionPage(page)
        if (useExistingTransaction) {
            await initTransactionsPage.table
                .getEntry(transactionTitle)
                .viewA.click()
        } else {
            await initTransactionsPage.newTransactionA.click()
            await newTransactionPage.createTransaction(transactionTitle)
        }
        await transactionPage.waitFor()
        await use(transactionPage)
    },

    transactionTitle: async ({ customTransactionTitle }, use) => {
        const title = customTransactionTitle ?? crypto.randomUUID()
        await use(title)
    },

    runPseudoFixture: async ({ browser, user, transactionTitle }, use) => {
        await use(async (callback, options) => {
            const pseudoFixture = new PseudoFixture(browser, {
                user,
                customTransactionTitle: transactionTitle,
                ...options
            })
            return await pseudoFixture.fullRun(callback)
        })
    }
})
