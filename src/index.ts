import { SyntheticEvent } from "react"

const PolyWeakMap: WeakMapConstructor = WeakMap || Map

const valueCache = new PolyWeakMap<(value: string, e: SyntheticEvent | Event) => void, (e: SyntheticEvent | Event) => void>()

/**
 * addValue allows you to write callbacks using the value of an input, select or
 * text area without needing to get an instance of the dom element.
 *
 * ```tsx
 * import {bindValue} from 'spicy'
 *
 * const click = (value: string, event: Event) => {
 *     // do something with value
 * })
 * <input onClick={bindValue(click)} >
 * ```
 *
 * @param cb
 */
export function bindValue(cb: (value: string, e: SyntheticEvent | Event) => void): (e: SyntheticEvent | Event) => void {
    let ret = valueCache.get(cb)
    if (ret === undefined) {
        ret = e => {
            if (e.currentTarget instanceof HTMLInputElement
                || e.currentTarget instanceof HTMLSelectElement
                || e.currentTarget instanceof HTMLTextAreaElement
            ) {
                return cb(e.currentTarget.value, e)
            }
            return cb('', e)
        }
        valueCache.set(cb, ret)
    }
    return ret
}

const argsCache = new PolyWeakMap<object, Map<unknown[], (...args: unknown[]) => void>>()

function arrayEqual(a: unknown[], b: unknown[]) {
    if (a.length !== b.length) {
        return false
    }
    for (let i = 0; i < a.length; i++) {
        if (!Object.is(a[i], b[i])) {
            return false
        }
    }
    return true
}

/**
 * The `bind` function takes in some arguments then a function and will
 * return a function with the first arguments bound to the ones passed in.
 *
 * If you call bind more than once with the same arguments it will return
 * the same instance of a function. Be carful with objects, if you pass an
 * object that has the same structure but is not the same reference it will
 * creat a new function.
 *
 * ```ts
 * const foo = (a: string, b: number) => a + ' ' + b
 *
 * const bar1 = bind('baz', foo)
 * // bar1 = (b: number) => 'baz' + ' ' + b
 *
 * const bar2 = bind('baz', foo)
 * // bar1 and bar2 are the same instance of a function
 * bar1 === bar2
 * ```
 *
 * Typescript won't let you have spread types first but if it did this is would
 * be the type
 * ```ts
 *  function bind<AX[], U extends unknown[]>(
 *     ...args: AX,
 *     callback: (...args: AX, ...originalArgs: U) => void,
 * ): (...originalArgs: U) => void
 * ```
 *
 * @param args
 * @param callback
 */
// tslint:disable: max-line-length
export function bind<A0, U extends unknown[]>(arg0: A0, callback: (arg0: A0, ...originalArgs: U) => void): (...originalArgs: U) => void
export function bind<A0, A1, U extends unknown[]>(arg0: A0, arg1: A1, callback: (arg0: A0, arg1: A1, ...originalArgs: U) => void): (...originalArgs: U) => void
export function bind<A0, A1, A2, U extends unknown[]>(arg0: A0, arg1: A1, arg2: A2, callback: (arg0: A0, arg1: A1, arg2: A2, ...originalArgs: U) => void): (...originalArgs: U) => void
export function bind<A0, A1, A2, A3, U extends unknown[]>(arg0: A0, arg1: A1, arg2: A2, arg3: A3, callback: (arg0: A0, arg1: A1, arg2: A2, arg3: A3, ...originalArgs: U) => void): (...originalArgs: U) => void
export function bind<A0, A1, A2, A3, A4, U extends unknown[]>(arg0: A0, arg1: A1, arg2: A2, arg3: A3, arg4: A4, callback: (arg0: A0, arg1: A1, arg2: A2, arg3: A3, arg4: A4, ...originalArgs: U) => void): (...originalArgs: U) => void
export function bind<A0, A1, A2, A3, A4, A5, U extends unknown[]>(arg0: A0, arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, callback: (arg0: A0, arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, ...originalArgs: U) => void): (...originalArgs: U) => void
export function bind<A0, A1, A2, A3, A4, A5, A6, U extends unknown[]>(arg0: A0, arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, callback: (arg0: A0, arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, ...originalArgs: U) => void): (...originalArgs: U) => void
export function bind<A0, A1, A2, A3, A4, A5, A6, A7, U extends unknown[]>(arg0: A0, arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, arg7: A7, callback: (arg0: A0, arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, arg7: A7, ...originalArgs: U) => void): (...originalArgs: U) => void
export function bind<A0, A1, A2, A3, A4, A5, A6, A7, A8, U extends unknown[]>(arg0: A0, arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, arg7: A7, arg8: A8, callback: (arg0: A0, arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, arg7: A7, arg8: A8, ...originalArgs: U) => void): (...originalArgs: U) => void
// tslint:enable: max-line-length
export function bind(...args: unknown[]): (...args: unknown[]) => void {
    // this function uses unknown types because typescript wont let me use
    // a spread argument first

    // remove the callback from the args
    const callback = args.pop()
    if (typeof callback !== 'function') {
        throw new Error('the last argument of addArgs must be a function')
    }

    // get the map of arguments that get used for the callback or create one
    let m = argsCache.get(callback)
    if (m === undefined) {
        m = new Map()
        argsCache.set(callback, m)
    }

    // check for an existing callback with the arguments applied or create it
    for (const [key, value] of m) {
        if (arrayEqual(key, args)) {
            return value
        }
    }
    const ret = (...childArgs: unknown[]) => callback(...args, ...childArgs)
    m.set(args, ret)

    return ret
}
