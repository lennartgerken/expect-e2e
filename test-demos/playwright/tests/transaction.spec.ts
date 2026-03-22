import { test } from '@/custom-test'
import { expect } from '@/custom-expect'
import { users } from '@/users'

test.describe('Transaction', () => {
    test.describe('create by role', () => {
        for (const user of [users.user, users.manager]) {
            test.describe(() => {
                test.use({ user })

                test(
                    user.username,
                    async ({
                        transactionTitle: title,
                        initTransactionsPage: transactionsPage,
                        newTransactionPage,
                        transactionPage
                    }) => {
                        await transactionsPage.newTransactionA.click()
                        await newTransactionPage.createTransaction(title)
                        await expect(transactionPage.titleH1).toHaveText(title)
                        await transactionPage.backToOverviewA.click()
                        await expect(
                            transactionsPage.table.getEntry(title)
                        ).toBeVisible()
                    }
                )
            })
        }
    })

    test.describe(() => {
        test.use({ user: users.viewer })

        test('disable creation for viewer', async ({
            page,
            initTransactionsPage: transactionsPage,
            newTransactionPage
        }) => {
            await expect(transactionsPage.newTransactionA).toBeHidden()
            await newTransactionPage.goto()
            await expect(page).toHaveURL('/transactions')
        })
    })

    test('save details', async ({
        transactionTitle,
        initTransactionPage: transactionPage,
        transactionsPage
    }) => {
        const data1 = 'data1'
        const data2 = 'Option 2'
        const data3 = 'Selection 3'

        await transactionPage.startButton.click()

        await test.step('Set details.', async () => {
            await transactionPage.detailsComponent.data1Input.fill(data1)
            await transactionPage.detailsComponent.data2Radio.setOption(data2)
            await transactionPage.detailsComponent.data3Select.selectOption({
                label: data3
            })
            await transactionPage.detailsComponent.saveButton.click()
            await expect(
                transactionPage.detailsComponent.successMessageP
            ).toBeVisible()
        })

        await transactionPage.backToOverviewA.click()
        await transactionsPage.table.getEntry(transactionTitle).open()

        await test.step('Validate details.', async () => {
            await expect(
                transactionPage.detailsComponent.data1Input
            ).toHaveValue(data1)
            await expect(
                transactionPage.detailsComponent.data2Radio
            ).toHaveCheckedOption(data2)
            await expect(
                transactionPage.detailsComponent.data3Select
            ).toHaveSelectedOption(data3)
        })
    })
})
