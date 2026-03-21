import { expect as baseExpect, Locator } from '@playwright/test'
import { LogExpect } from 'set-steps'

export const expect = new LogExpect(baseExpect)
    .defineLogs<[Locator]>([
        {
            toHaveText: (locator, not, expected) =>
                `Expect '${locator}' ${not ? 'not ' : ''}to have text '${expected}'.`,
            toBeHidden: (locator, not) =>
                `Expect '${locator}' ${not ? 'not ' : ''}to be hidden.`
        }
    ])
    .build()
