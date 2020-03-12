# Spicy

Spicy is a simple helper library for React and Preact.

## `bindValue()`

`bindValue` adds the value to the beginning of an event handler function.

```tsx
import { bindValue } from 'spicy'

const click = (value: string, event: Event) => {
    // do something with value
})

<input onClick={bindValue(click)} >
```

If you call it twice with the same function it will return the same reference,
you don't need to worry about saving the result.

```tsx
import { bindValue } from 'spicy'

const click = (value: string, event: Event) => {})

bindValue(click) === bindValue(click)
```

## `bind()`

`bind` lets you add arbitrary arguments to the beginning of a function and will
return the same instance of a function if called with the same arguments.

```ts
import { bind } from 'spicy'

const foo = (a: string, b: number) => a + ' ' + b

const bar1 = bind('baz', foo)
// bar1 = (b: number) => 'baz' + ' ' + b

const bar2 = bind('baz', foo)
// bar1 and bar2 are the same instance of a function

bar1 === bar2
```

### In Loops

`bind` is useful for adding callbacks to lists.

```tsx
import { bind } from 'spicy'

function onClick(item: string) {
    alert(item)
}

/**
 * Foo renders a list of strings and will alert with the text of the item when
 * it is clicked
 */
function Foo(props: { list: string }) {
    return <ul>
        {props.list.map(item => (
            <li onClick={bind(item, onClick)}>{item}</li>
        ))}
    </ul>
}
```

### Objects

You can use objects as arguments to pass into function but if you are not carful
you can end up making a new function every render. It will only return the same
instance of a function if all of the arguments return true when compared with
`Object.is`.

```ts
import { bind } from 'spicy'

const merge = (a: object, b: object) => { ...a, ...b }

bind({}, merge) !== bind({}, merge)
// since the 2 objects do not have the same reference the will make different
// function

const foo = {}
bind(foo, merge) === bind(foo, merge)
// these function are the same because they both use the same instance of the
// object
```
