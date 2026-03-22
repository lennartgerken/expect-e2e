/* eslint-disable playwright/valid-expect */
import { expect as baseExpect, Locator, Page } from '@playwright/test'
import { LogExpect } from 'set-steps'
import { RadioComponent } from './components/radio-component'

export const expect = new LogExpect(baseExpect)
    .defineLogs<[Locator, Page]>([
        {
            toBeDisabled: (locator, not) =>
                `Expect '${locator}' ${not ? 'not ' : ''}to be disabled.`,
            toBeHidden: (locator, not) =>
                `Expect '${locator}' ${not ? 'not ' : ''}to be hidden.`,
            toHaveValue: (locator, not, expected) =>
                `Expect '${locator}' ${not ? 'not ' : ''}to have value '${expected}'.`,
            toBeVisible: (locator, not) =>
                `Expect '${locator}' ${not ? 'not ' : ''}to be visible.`,
            toHaveAttribute: (locator, not, attribute, value) =>
                `Expect '${locator}' ${not ? 'not ' : ''}to have attribute '${attribute}'${value ? ` with value '${value}'` : ''}.`,
            toHaveText: (locator, not, expected) =>
                `Expect '${locator}' ${not ? 'not ' : ''}to have text '${expected}'.`
        },
        {
            toHaveURL: (_page, not, expected) =>
                `Expect page URL ${not ? 'not ' : ''}to be '${expected}'.`
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
            },
            async toHaveCheckedOption(radio: RadioComponent, option: string) {
                const assertionName = 'toHaveCheckedOption'
                let pass: boolean
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let matcherResult: any
                try {
                    const expectation = this.isNot
                        ? expect(radio.getOption(option)).not
                        : expect(radio.getOption(option))
                    await expectation.toBeChecked()
                    pass = true
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (e: any) {
                    matcherResult = e.matcherResult
                    pass = false
                }

                if (this.isNot) pass = !pass

                const message = () =>
                    `'${radio}' is ${this.isNot ? '' : 'not '}checked for option '${option}'.\n\n` +
                    (matcherResult?.message ? matcherResult.message : '') +
                    (matcherResult?.log ? matcherResult.log : '')

                return {
                    message,
                    pass,
                    name: assertionName
                }
            },
            async toHaveSelectedOption(locator: Locator, optionLabel: string) {
                const assertionName = 'toHaveSelectedOption'
                let pass: boolean
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let matcherResult: any
                try {
                    const optionLocator = locator.getByRole('option', {
                        name: optionLabel
                    })
                    const expectation = this.isNot
                        ? expect(optionLocator).not
                        : expect(optionLocator)
                    await expectation.toHaveAttribute('selected')
                    pass = true
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (e: any) {
                    matcherResult = e.matcherResult
                    pass = false
                }

                if (this.isNot) pass = !pass

                const message = () =>
                    `'${locator}' ${this.isNot ? '' : 'not '}have selected option '${optionLabel}'.\n\n` +
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
                `Expect '${locator}' ${not ? 'not ' : ''}to be disabled by attribute.`,
            toHaveCheckedOption: (radio, not, option) =>
                `Expect '${radio}' ${not ? 'not ' : ''}to have checked option '${option}'.`,
            toHaveSelectedOption: (locator, not, optionLabel) =>
                `Expect '${locator}' ${not ? 'not ' : ''}to have selected option '${optionLabel}'.`
        }
    )
    .build()
