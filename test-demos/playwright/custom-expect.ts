/* eslint-disable playwright/valid-expect */
import { expect as baseExpect, Locator } from '@playwright/test'
import { LogExpect } from 'set-steps'

export const expect = new LogExpect(baseExpect)
    .defineLogs<[Locator]>([
        {
            toBeDisabled: (locator, not) =>
                `Expect '${locator}' ${not ? 'not ' : ''}to be disabled.`,
            toBeHidden: (locator, not) =>
                `Expect '${locator}' ${not ? 'not ' : ''}to be hidden.`,
            toHaveAttribute: (locator, not, attribute, value) =>
                `Expect '${locator}' ${not ? 'not ' : ''}to have attribute '${attribute}'${value ? ` with value '${value}'` : ''}.`,
            toHaveText: (locator, not, expected) =>
                `Expect '${locator}' ${not ? 'not ' : ''}to have text '${expected}'.`
        }
    ])
    .defineCustomMatchers(
        {
            async toBeDisabledByAttribute(locator: Locator) {
                const assertionName = 'toBeDisabledByAttribute'
                let pass: boolean
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let matcherResult: any
                try {
                    const expectation = this.isNot
                        ? expect(locator).not
                        : expect(locator)
                    await expectation.toHaveAttribute('disabled')
                    pass = true
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (e: any) {
                    matcherResult = e.matcherResult
                    pass = false
                }

                if (this.isNot) pass = !pass

                const message = () =>
                    `'${locator}' is ${this.isNot ? '' : 'not '}disabled.\n\n` +
                    (matcherResult?.message ? matcherResult.message : '') +
                    (matcherResult?.log ? matcherResult.log : '')

                return {
                    message,
                    pass,
                    name: assertionName
                }
            }
        },
        {
            toBeDisabledByAttribute: (locator, not) =>
                `Expect '${locator}' ${not ? 'not ' : ''}to be disabled by attribute.`
        }
    )
    .build()
