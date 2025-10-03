import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'

const label = 'Checkbox label'

describe('accessibleCheckboxProps', () => {
  it.each([true, false])('should return accessibility props with state in native', (checked) => {
    const props = accessibleCheckboxProps({ checked, label })

    expect(props).toMatchObject({
      accessibilityRole: AccessibilityRole.CHECKBOX,
      accessibilityLabel: label,
      accessibilityState: { checked },
    })
  })

  it('should return accessibility required prop when required in native', () => {
    const props = accessibleCheckboxProps({ checked: false, label, required: true })

    expect(props).toMatchObject({
      accessibilityRole: AccessibilityRole.CHECKBOX,
      accessibilityLabel: `${label} - obligatoire`,
      accessibilityState: { checked: false },
    })
  })
})
