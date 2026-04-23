import { AB_TESTS } from 'shared/useABSegment/abTests'

export type ABTestSegment = string
export type ABTestDefinition = {
  id: string
  label: string
  segments: ABTestSegment[]
}
export const AB_TESTS_REGISTRY: ABTestDefinition[] = [
  {
    id: AB_TESTS.PRO_REVIEWS_ON_VENUE,
    label: 'Avis des pros sur les pages lieu',
    segments: ['A', 'B'],
  },
  {
    id: AB_TESTS.PRO_REVIEWS_ON_OFFER,
    label: 'Avis des pros sur les pages offres',
    segments: ['A', 'B'],
  },
]
export const getABTestById = (id: string): ABTestDefinition | undefined =>
  AB_TESTS_REGISTRY.find((test) => test.id === id)
