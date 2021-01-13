# Back Navigation

## Usage

Let say we went from page A to page B and we want to go back.

But, on going back we want to apply a specific task. That means, we want to go back:

```ts
navigate('PageB', {
  backNavigation: {
    from: 'PageA',
    params: {
      // protect against a potential evolution of the current route (PageA) params
      ...params,
      contextualParameter: ...
    },
  },
})
```

## The back navigation function BPMN

![BPMN](./bpmn.png)
