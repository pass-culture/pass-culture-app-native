# Error Management

### Why

- Handle different errors in the application
- Use custom error handlers

### Key points

In order to handle errors globally in the application, we have defined an `ErrorBoundary` component on top of `LocationWrapper`.
Which means he also wrap the `RootNavigator` one.

### ErrorBoundary

The `ErrorBoundary` will intercept errors coming from wrapped components and render a custom error page through its `FallbackComponent` argument.
In our case, we've defined `AsyncErrorBoundary` to be the default error page.
Every error linked to component life cycle will be caught by the ErrorBoundary when not handle at a lower level.
This means if you have several `ErrorBoundaries` that wrap a specific component, the error will be handled by the closest one.

If you want to override the default `ErrorBoundary`, you can wrap your component like this :

```tsx
export const MyComponent = withErrorBoundary(React.memo(MyWrappedComponent), {
  FallbackComponent: ErrorBoundaryCustomPage,
})
```

### Limitations

`ErrorBoundaries` can't handle some type of errors coming from the child component
and especially errors during asynchronous calls such as API calls triggered by user action
(see more details here : <https://fr.reactjs.org/docs/error-boundaries.html>).
For example, this component (inside an ErrorBoundary) will not be intercepted:

```tsx
export function MyComponent(props: Props) {
  async function userAction() {
    await api
      .callSomeApiEndpoint()
      .then(() => {
        doSomething()
      })
      .catch((error) => {
        throw new Error('Error message')
      })
  }

  return <Button onPress={userAction} />
}
```

Another example, with error not catch by higher `ErrorBoundary` :

```tsx
export function MyComponent(props: Props) {
  useEffect(() => {
    setTimeout(() => {
      throw new Error('use effect error')
    }, 10)
  }

  return (...)
}
```

### Mistakes to avoid when following the standard

We didn't find any magic method to handle all types of error globally.
We recommend handling every asynchronous API calls with custom error handler.

Example:

```tsx
export function MyComponent(props: Props) {
  async function userAction() {
    await api
      .callSomeApiEndpoint()
      .then(() => {
        doSomething()
      })
      .catch((error) => {
        displayCustomErrorBoundary('Error calling API', () => {
          userAction() // allow you to retry action in error page
        })
      })
  }

  return <Button onPress={userAction} />
}
```

### Resources

<https://fr.reactjs.org/docs/error-boundaries.html>
