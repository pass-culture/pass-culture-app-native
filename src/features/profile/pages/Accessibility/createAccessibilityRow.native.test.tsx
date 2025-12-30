import { navigate } from '__mocks__/@react-navigation/native'
import { createAccessibilityRow } from 'features/profile/pages/Accessibility/createAccessibilityRow'
import { render } from 'tests/utils'
import { SectionRow } from 'ui/components/SectionRow'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'

jest.mock('ui/components/SectionRow', () => ({ SectionRow: jest.fn(() => null) }))

const navigateConfig = { title: 'Plan du site', screen: 'SiteMapScreen' } as const
const clickableConfig = { title: 'Accessibilité', externalNav: { url: 'https://example.com' } }

describe('createAccessibilityRow', () => {
  it('should render a navigable row for internal navigation', () => {
    render(createAccessibilityRow(navigateConfig, 0, navigate))

    expect(SectionRow).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Plan du site',
        type: 'navigable',
        noTopMargin: true,
        onPress: expect.any(Function),
      }),
      undefined
    )
  })

  it('should render a clickable row for external navigation', () => {
    render(createAccessibilityRow(clickableConfig, 0, navigate))

    expect(SectionRow).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Accessibilité',
        type: 'clickable',
        noTopMargin: true,
        externalNav: { url: 'https://example.com' },
        icon: ExternalSiteFilled,
      }),
      undefined
    )
  })

  it('should set noTopMargin to false when index is not 0', () => {
    render(createAccessibilityRow(clickableConfig, 2, navigate))

    expect(SectionRow).toHaveBeenCalledWith(
      expect.objectContaining({ noTopMargin: false }),
      undefined
    )
  })
})
