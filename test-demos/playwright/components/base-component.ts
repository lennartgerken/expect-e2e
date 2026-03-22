import { Locator } from '@playwright/test'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging, @typescript-eslint/consistent-type-definitions
export interface BaseComponent extends Locator {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export abstract class BaseComponent {
    protected baseLocator: Locator

    constructor(baseLocator: Locator) {
        this.baseLocator = baseLocator

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const parent = this
        const proxy = new Proxy(baseLocator, {
            get(target, prop, receiver) {
                if (prop in parent) return Reflect.get(parent, prop, receiver)
                return Reflect.get(target, prop, receiver)
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return proxy as any
    }

    toString() {
        return this.baseLocator.toString()
    }
}
