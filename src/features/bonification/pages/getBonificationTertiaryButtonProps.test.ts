import { getBonificationTertiaryButtonProps } from 'features/bonification/pages/getBonificationTertiaryButtonProps'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { Invalidate } from 'ui/svg/icons/Invalidate'

const goBack = jest.fn()
const baseDisplayProps = {
  icon: Invalidate,
  wording: 'Annuler',
}

describe('getBonificationTertiaryButtonProps', () => {
  it('returns external navigation props when externalNav is provided', () => {
    const buttonProps = getBonificationTertiaryButtonProps({
      button: {
        ...baseDisplayProps,
        navigation: { type: 'externalNav', externalNav: { url: 'https://pass.culture.fr' } },
      },
      onGoBack: goBack,
    })

    expect(buttonProps.externalNav).toEqual({ url: 'https://pass.culture.fr' })
    expect(buttonProps).not.toHaveProperty('onPress')
    expect(buttonProps).not.toHaveProperty('navigateTo')
  })

  it('returns goBack onPress props when shouldGoBack is true', () => {
    const buttonProps = getBonificationTertiaryButtonProps({
      button: {
        ...baseDisplayProps,
        navigation: { type: 'goBack' },
      },
      onGoBack: goBack,
    })

    expect(buttonProps.onPress).toBe(goBack)
    expect(buttonProps).not.toHaveProperty('externalNav')
    expect(buttonProps).not.toHaveProperty('navigateTo')
  })

  it('returns internal navigation props when navigateTo is provided', () => {
    const buttonProps = getBonificationTertiaryButtonProps({
      button: {
        ...baseDisplayProps,
        navigation: { type: 'navigateTo', navigateTo: navigateToHomeConfig },
      },
      onGoBack: goBack,
    })

    expect(buttonProps.navigateTo).toEqual(navigateToHomeConfig)
    expect(buttonProps).not.toHaveProperty('externalNav')
    expect(buttonProps).not.toHaveProperty('onPress')
  })
})
