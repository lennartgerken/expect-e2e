import test from '@playwright/test'
import { BaseComponent } from './base-component'

export class RadioComponent extends BaseComponent {
    getOption(label: string) {
        return this.getByRole('radio', { name: label }).describe(
            `Option ${label}`
        )
    }

    async setOption(label: string) {
        await test.step(`Set option '${label}' in '${this}'`, async () => {
            await this.getOption(label).check()
        })
    }
}
