import { Locator } from '@playwright/test'
import { BaseComponent } from '../base-component'
import { RadioComponent } from '../radio-component'

export class DetailsComponent extends BaseComponent {
    readonly data1Input: Locator
    readonly data2Radio: RadioComponent
    readonly data3Select: Locator
    readonly saveButton: Locator

    constructor(baseLocator: Locator) {
        super(baseLocator)

        this.data1Input = this.getByLabel('Data 1').describe('Data 1')
        this.data2Radio = new RadioComponent(
            this.getByTestId('Data 2').describe('Data 2')
        )
        this.data3Select = this.getByLabel('Data 3').describe('Data 3')
        this.saveButton = this.getByRole('button', {
            name: 'Save Details'
        }).describe('Save Details')
    }
}
