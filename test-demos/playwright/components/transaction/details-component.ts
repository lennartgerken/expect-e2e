import { Locator } from '@playwright/test'
import { BaseComponent } from '../base-component'
import { RadioComponent } from '../radio-component'

export class DetailsComponent extends BaseComponent {
    readonly fieldset: Locator
    readonly data1Input: Locator
    readonly data2Radio: RadioComponent
    readonly data3Select: Locator
    readonly successMessageP: Locator
    readonly saveButton: Locator

    constructor(baseLocator: Locator) {
        super(baseLocator)

        this.fieldset = this.locator('fieldset').first().describe('Fieldset')
        this.data1Input = this.getByLabel('Data 1').describe('Data 1')
        this.data2Radio = new RadioComponent(
            this.getByTestId('Data 2').describe('Data 2')
        )
        this.data3Select = this.getByLabel('Data 3').describe('Data 3')
        this.successMessageP = this.getByText(
            'Details updated successfully'
        ).describe('Success Message')
        this.saveButton = this.getByRole('button', {
            name: 'Save Details'
        }).describe('Save Details')
    }
}
