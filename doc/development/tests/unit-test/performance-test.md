## Performance Test with reassure

Why ?

- To be notified in case of a performance regression of an app screen ;
- Have a better understanding of page performance : number of rerenders and render duration.

### Key points

- Performance test should be only on **native** and on **pages/screens**
- Performance measurements are run 10 times for each test
- You can define a scenario if you want to test a specific behavior (like a booking process)

> 💡 It is possible to generate a performance test model with the snippet (vscode) `perf-test`

```jsx
describe('<MyPage />', () => {
  it('Performance test', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    await measurePerformance(reactQueryProviderHOC(<MyPage />), {
      // Add scenario if necessary
      scenario: async () => {
        await screen.findByTestId('container')
      },
    })
  })
})
```
