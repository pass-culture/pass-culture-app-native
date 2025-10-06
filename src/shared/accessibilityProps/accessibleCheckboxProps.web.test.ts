import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { accessibleCheckboxProps } from 'shared/accessibilityProps/accessibleCheckboxProps'

const label = 'Checkbox label'

describe('accessibleCheckboxProps', () => {
  it.each([true, false])(
    'should return accessibility props with accessibilityChecked in web',
    (checked) => {
      const props = accessibleCheckboxProps({ checked, label })

      expect(props).toMatchObject({
        accessibilityRole: AccessibilityRole.CHECKBOX,
        accessibilityLabel: label,
        accessibilityChecked: checked,
      })
    }
  )

  it('should return accessibility required prop when required in web', () => {
    const props = accessibleCheckboxProps({ checked: false, label, required: true })

    expect(props).toMatchObject({
      accessibilityRole: AccessibilityRole.CHECKBOX,
      accessibilityLabel: `${label} - obligatoire`,
      accessibilityChecked: false,
      accessibilityRequired: true,
    })
  })
})
