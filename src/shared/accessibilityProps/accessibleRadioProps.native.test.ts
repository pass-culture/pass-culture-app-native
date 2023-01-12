import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'

const label = 'Radio button label'
describe('accessibleRadioProps', () => {
  it.each([true, false])('should return accessibility props with state in native', (checked) => {
    const props = accessibleRadioProps({ checked, label })

    expect(props).toMatchObject({
      accessibilityRole: AccessibilityRole.RADIO,
      accessibilityLabel: label,
      accessibilityState: { checked },
    })
  })
})
