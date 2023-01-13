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
})
