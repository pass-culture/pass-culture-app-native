export type ABTestDefinition = {
  id: string
  label: string
  segments: string[]
}
export const AB_TESTS_REGISTRY: ABTestDefinition[] = []
export const getABTestById = (id: string): ABTestDefinition | undefined =>
  AB_TESTS_REGISTRY.find((test) => test.id === id)
