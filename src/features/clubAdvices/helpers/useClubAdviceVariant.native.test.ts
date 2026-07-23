import { SubcategoryIdEnum } from 'api/gen'
import { useClubAdviceVariant } from 'features/clubAdvices/helpers/useClubAdviceVariant'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { renderHook } from 'tests/utils'

describe('useClubAdviceVariant', () => {
  it('should return undefined when subcategory is not defined', () => {
    setFeatureFlags()

    const { result } = renderHook(() => useClubAdviceVariant())

    expect(result.current).toBeUndefined()
  })

  it('should return undefined when subcategory has no club', () => {
    setFeatureFlags()

    const { result } = renderHook(() => useClubAdviceVariant(SubcategoryIdEnum.CARTE_MUSEE))

    expect(result.current).toBeUndefined()
  })

  it.each([SubcategoryIdEnum.LIVRE_PAPIER, SubcategoryIdEnum.SEANCE_CINE])(
    'should return the variant for %s whatever the scene club feature flag',
    (subcategoryId) => {
      setFeatureFlags()

      const { result } = renderHook(() => useClubAdviceVariant(subcategoryId))

      expect(result.current).toBeDefined()
    }
  )

  it('should return the scène club variant when feature flag is enabled', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_SCENE_CLUB])

    const { result } = renderHook(() =>
      useClubAdviceVariant(SubcategoryIdEnum.SPECTACLE_REPRESENTATION)
    )

    expect(result.current?.titleSection).toEqual('Les avis de la scène club')
  })

  it('should not return the scène club variant when feature flag is disabled', () => {
    setFeatureFlags()

    const { result } = renderHook(() =>
      useClubAdviceVariant(SubcategoryIdEnum.SPECTACLE_REPRESENTATION)
    )

    expect(result.current).toBeUndefined()
  })
})
