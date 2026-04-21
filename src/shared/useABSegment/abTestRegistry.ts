export type ABTestSegment = string
export type ABTestDefinition = {
  id: string
  label: string
  segments: ABTestSegment[]
}
export const AB_TESTS_REGISTRY: ABTestDefinition[] = [
  {
    id: 'enableProReviewsVenueABTesting',
    label: 'Pro reviews venue — enable pro reviews venue AB testing',
    segments: ['A', 'B'],
  },
]
export const getABTestById = (id: string): ABTestDefinition | undefined =>
  AB_TESTS_REGISTRY.find((test) => test.id === id)
