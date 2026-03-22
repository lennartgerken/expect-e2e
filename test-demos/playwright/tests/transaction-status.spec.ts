import { expect } from '@/custom-expect'
import { test } from '@/custom-test'
import { TransactionPage } from '@/pages/transaction.page'
import { TransactionsPage } from '@/pages/transactions-page'
import { users } from '@/users'

enum StatusLabel {
    NEW = 'New',
    IN_PROGRESS = 'In Progress',
    REVIEW = 'Review',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled'
}

test.describe('Transaction Status', () => {
    test.describe(StatusLabel.NEW, () => {
        test('show status', async ({
            transactionTitle,
            initTransactionsPage: transactionsPage,
            initTransactionPage: transactionPage
        }) => {
            await expectStatusToShow(
                StatusLabel.NEW,
                transactionPage,
                transactionsPage,
                transactionTitle
            )
        })

        test.describe('change status by role', () => {
            test.describe('user', () => {
                test('start', async ({
                    initTransactionPage: transactionPage
                }) => {
                    await transactionPage.startButton.click()
                    await expect(transactionPage.statusDiv).toHaveText(
                        StatusLabel.IN_PROGRESS
                    )
                })
            })

            test.describe('manager', () => {
                test.use({ user: users.manager })

                test('start', async ({
                    initTransactionPage: transactionPage
                }) => {
                    await transactionPage.startButton.click()
                    await expect(transactionPage.statusDiv).toHaveText(
                        StatusLabel.IN_PROGRESS
                    )
                })

                test('cancel', async ({
                    initTransactionPage: transactionPage
                }) => {
                    await transactionPage.cancelButton.click()
                    await expect(transactionPage.statusDiv).toHaveText(
                        StatusLabel.CANCELLED
                    )
                })
            })
        })

        test.describe('disable actions by role', () => {
            test('user', async ({ initTransactionPage: transactionPage }) => {
                await expect(transactionPage.cancelButton).toBeHidden()
                await expect(transactionPage.requestReviewButton).toBeHidden()
                await expect(transactionPage.returnButton).toBeHidden()
                await expect(transactionPage.completeButton).toBeHidden()
                await expect(
                    transactionPage.detailsComponent.fieldset
                ).toBeDisabledByAttribute()
            })

            test.describe(() => {
                test.use({ user: users.manager })

                test('manager', async ({
                    initTransactionPage: transactionPage
                }) => {
                    await expect(
                        transactionPage.requestReviewButton
                    ).toBeHidden()
                    await expect(transactionPage.returnButton).toBeHidden()
                    await expect(transactionPage.completeButton).toBeHidden()
                    await expect(
                        transactionPage.detailsComponent.fieldset
                    ).toBeDisabledByAttribute()
                })
            })

            test.describe(() => {
                test.use({ user: users.viewer, useExistingTransaction: true })

                test.beforeEach(async ({ runPseudoFixture }) => {
                    await runPseudoFixture(
                        async ({ initTransactionPage: _ }) => {
                            /* empty */
                        },
                        { user: users.user }
                    )
                })

                test('viewer', async ({
                    initTransactionPage: transactionPage
                }) => {
                    await expect(transactionPage.startButton).toBeHidden()
                    await expect(transactionPage.cancelButton).toBeHidden()
                    await expect(
                        transactionPage.requestReviewButton
                    ).toBeHidden()
                    await expect(transactionPage.returnButton).toBeHidden()
                    await expect(transactionPage.completeButton).toBeHidden()
                    await expect(
                        transactionPage.detailsComponent.fieldset
                    ).toBeDisabledByAttribute()
                })
            })
        })
    })

    test.describe(StatusLabel.IN_PROGRESS, () => {
        test.describe(() => {
            test.use({ useExistingTransaction: true })

            test.beforeEach(async ({ runPseudoFixture }) => {
                await runPseudoFixture(
                    async ({ initTransactionPage: transactionPage }) => {
                        await transactionPage.startButton.click()
                    },
                    { user: users.user }
                )
            })

            test('show status', async ({
                transactionTitle,
                initTransactionsPage: transactionsPage,
                initTransactionPage: transactionPage
            }) => {
                await expectStatusToShow(
                    StatusLabel.IN_PROGRESS,
                    transactionPage,
                    transactionsPage,
                    transactionTitle
                )
            })

            test.describe('edit details by role', () => {
                test('user', async ({
                    initTransactionPage: transactionPage
                }) => {
                    await expectDetailsToBeEditable(transactionPage)
                })

                test.describe(() => {
                    test.use({ user: users.manager })

                    test('manager', async ({
                        initTransactionPage: transactionPage
                    }) => {
                        await expectDetailsToBeEditable(transactionPage)
                    })
                })
            })

            test.describe('change status by role', () => {
                test.describe('user', () => {
                    test('request review', async ({
                        initTransactionPage: transactionPage
                    }) => {
                        await transactionPage.requestReviewButton.click()
                        await expect(transactionPage.statusDiv).toHaveText(
                            StatusLabel.REVIEW
                        )
                    })
                })

                test.describe('manager', () => {
                    test.use({ user: users.manager })

                    test('complete', async ({
                        initTransactionPage: transactionPage
                    }) => {
                        await transactionPage.completeButton.click()
                        await expect(transactionPage.statusDiv).toHaveText(
                            StatusLabel.COMPLETED
                        )
                    })

                    test('cancel', async ({
                        initTransactionPage: transactionPage
                    }) => {
                        await transactionPage.cancelButton.click()
                        await expect(transactionPage.statusDiv).toHaveText(
                            StatusLabel.CANCELLED
                        )
                    })
                })
            })

            test.describe('disable actions by role', () => {
                test('user', async ({
                    initTransactionPage: transactionPage
                }) => {
                    await expect(transactionPage.startButton).toBeHidden()
                    await expect(transactionPage.cancelButton).toBeHidden()
                    await expect(transactionPage.returnButton).toBeHidden()
                    await expect(transactionPage.completeButton).toBeHidden()
                })

                test.describe(() => {
                    test.use({ user: users.manager })

                    test('manager', async ({
                        initTransactionPage: transactionPage
                    }) => {
                        await expect(
                            transactionPage.requestReviewButton
                        ).toBeHidden()
                        await expect(transactionPage.startButton).toBeHidden()
                        await expect(transactionPage.returnButton).toBeHidden()
                    })
                })

                test.describe(() => {
                    test.use({ user: users.viewer })

                    test('viewer', async ({
                        initTransactionPage: transactionPage
                    }) => {
                        await expect(transactionPage.startButton).toBeHidden()
                        await expect(transactionPage.cancelButton).toBeHidden()
                        await expect(
                            transactionPage.requestReviewButton
                        ).toBeHidden()
                        await expect(transactionPage.returnButton).toBeHidden()
                        await expect(
                            transactionPage.completeButton
                        ).toBeHidden()
                        await expect(
                            transactionPage.detailsComponent.fieldset
                        ).toBeDisabledByAttribute()
                    })
                })
            })
        })
    })

    test.describe(StatusLabel.REVIEW, () => {
        test.describe(() => {
            test.use({ useExistingTransaction: true })

            test.beforeEach(async ({ runPseudoFixture }) => {
                await runPseudoFixture(
                    async ({ initTransactionPage: transactionPage }) => {
                        await transactionPage.startButton.click()
                        await transactionPage.requestReviewButton.click()
                    },
                    { user: users.user }
                )
            })

            test('show status', async ({
                transactionTitle,
                initTransactionsPage: transactionsPage,
                initTransactionPage: transactionPage
            }) => {
                await expectStatusToShow(
                    StatusLabel.REVIEW,
                    transactionPage,
                    transactionsPage,
                    transactionTitle
                )
            })

            test.describe('edit details by role', () => {
                test.describe(() => {
                    test.use({ user: users.manager })

                    test('manager', async ({
                        initTransactionPage: transactionPage
                    }) => {
                        await expectDetailsToBeEditable(transactionPage)
                    })
                })
            })

            test.describe('change status by role', () => {
                test.describe('manager', () => {
                    test.use({ user: users.manager })

                    test('complete', async ({
                        initTransactionPage: transactionPage
                    }) => {
                        await transactionPage.completeButton.click()
                        await expect(transactionPage.statusDiv).toHaveText(
                            StatusLabel.COMPLETED
                        )
                    })

                    test('cancel', async ({
                        initTransactionPage: transactionPage
                    }) => {
                        await transactionPage.cancelButton.click()
                        await expect(transactionPage.statusDiv).toHaveText(
                            StatusLabel.CANCELLED
                        )
                    })

                    test('return', async ({
                        initTransactionPage: transactionPage
                    }) => {
                        await transactionPage.returnButton.click()
                        await expect(transactionPage.statusDiv).toHaveText(
                            StatusLabel.IN_PROGRESS
                        )
                    })
                })
            })

            test.describe('disable actions by role', () => {
                test('user', async ({
                    initTransactionPage: transactionPage
                }) => {
                    await expect(transactionPage.startButton).toBeHidden()
                    await expect(
                        transactionPage.requestReviewButton
                    ).toBeHidden()
                    await expect(transactionPage.cancelButton).toBeHidden()
                    await expect(transactionPage.returnButton).toBeHidden()
                    await expect(transactionPage.completeButton).toBeHidden()
                    await expect(
                        transactionPage.detailsComponent.fieldset
                    ).toBeDisabledByAttribute()
                })

                test.describe(() => {
                    test.use({ user: users.manager })

                    test('manager', async ({
                        initTransactionPage: transactionPage
                    }) => {
                        await expect(
                            transactionPage.requestReviewButton
                        ).toBeHidden()
                        await expect(transactionPage.startButton).toBeHidden()
                    })
                })

                test.describe(() => {
                    test.use({ user: users.viewer })

                    test('viewer', async ({
                        initTransactionPage: transactionPage
                    }) => {
                        await expect(transactionPage.startButton).toBeHidden()
                        await expect(transactionPage.cancelButton).toBeHidden()
                        await expect(
                            transactionPage.requestReviewButton
                        ).toBeHidden()
                        await expect(transactionPage.returnButton).toBeHidden()
                        await expect(
                            transactionPage.completeButton
                        ).toBeHidden()
                        await expect(
                            transactionPage.detailsComponent.fieldset
                        ).toBeDisabledByAttribute()
                    })
                })
            })
        })
    })

    test.describe(StatusLabel.COMPLETED, () => {
        test.describe(() => {
            test.use({ useExistingTransaction: true })

            test.beforeEach(async ({ runPseudoFixture }) => {
                await runPseudoFixture(
                    async ({ initTransactionPage: transactionPage }) => {
                        await transactionPage.startButton.click()
                        await transactionPage.completeButton.click()
                    },
                    { user: users.manager }
                )
            })

            test('show status', async ({
                transactionTitle,
                initTransactionsPage: transactionsPage,
                initTransactionPage: transactionPage
            }) => {
                await expectStatusToShow(
                    StatusLabel.COMPLETED,
                    transactionPage,
                    transactionsPage,
                    transactionTitle
                )
            })

            test.describe('disable actions by role', () => {
                for (const user of [users.user, users.manager, users.viewer]) {
                    test.describe(() => {
                        test.use({ user })

                        test(
                            user.username,
                            async ({
                                initTransactionPage: transactionPage
                            }) => {
                                await expect(
                                    transactionPage.startButton
                                ).toBeHidden()
                                await expect(
                                    transactionPage.cancelButton
                                ).toBeHidden()
                                await expect(
                                    transactionPage.requestReviewButton
                                ).toBeHidden()
                                await expect(
                                    transactionPage.returnButton
                                ).toBeHidden()
                                await expect(
                                    transactionPage.completeButton
                                ).toBeHidden()
                                await expect(
                                    transactionPage.detailsComponent.fieldset
                                ).toBeDisabledByAttribute()
                            }
                        )
                    })
                }
            })
        })
    })

    test.describe(StatusLabel.CANCELLED, () => {
        test.describe(() => {
            test.use({ useExistingTransaction: true })

            test.beforeEach(async ({ runPseudoFixture }) => {
                await runPseudoFixture(
                    async ({ initTransactionPage: transactionPage }) => {
                        await transactionPage.startButton.click()
                        await transactionPage.cancelButton.click()
                    },
                    { user: users.manager }
                )
            })

            test('show status', async ({
                transactionTitle,
                initTransactionsPage: transactionsPage,
                initTransactionPage: transactionPage
            }) => {
                await expectStatusToShow(
                    StatusLabel.CANCELLED,
                    transactionPage,
                    transactionsPage,
                    transactionTitle
                )
            })

            test.describe('disable actions by role', () => {
                for (const user of [users.user, users.manager, users.viewer]) {
                    test.describe(() => {
                        test.use({ user })

                        test(
                            user.username,
                            async ({
                                initTransactionPage: transactionPage
                            }) => {
                                await expect(
                                    transactionPage.startButton
                                ).toBeHidden()
                                await expect(
                                    transactionPage.cancelButton
                                ).toBeHidden()
                                await expect(
                                    transactionPage.requestReviewButton
                                ).toBeHidden()
                                await expect(
                                    transactionPage.returnButton
                                ).toBeHidden()
                                await expect(
                                    transactionPage.completeButton
                                ).toBeHidden()
                                await expect(
                                    transactionPage.detailsComponent.fieldset
                                ).toBeDisabledByAttribute()
                            }
                        )
                    })
                }
            })
        })
    })
})

async function expectStatusToShow(
    status: StatusLabel,
    transactionPage: TransactionPage,
    transactionsPage: TransactionsPage,
    transactionTitle: string
) {
    await expect(transactionPage.statusDiv).toHaveText(status)
    await transactionPage.backToOverviewA.click()
    await expect(
        transactionsPage.table.getEntry(transactionTitle).statusDiv
    ).toHaveText(status)
}

async function expectDetailsToBeEditable(transactionPage: TransactionPage) {
    await transactionPage.detailsComponent.data1Input.fill('New Data 1')
    await transactionPage.detailsComponent.saveButton.click()
    await expect(transactionPage.detailsComponent.successMessageP).toBeVisible()
}
