import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

describe('setTextSemantic()', () => {
  it.each`
    headingLevel | accessibilityLevel | accessibilityRole
    ${'h1'}      | ${'h1'}            | ${AccessibilityRole.HEADER}
    ${'h2'}      | ${'h2'}            | ${AccessibilityRole.HEADER}
    ${'h3'}      | ${'h3'}            | ${AccessibilityRole.HEADER}
    ${'h4'}      | ${'h4'}            | ${AccessibilityRole.HEADER}
    ${'p'}       | ${'p'}             | ${AccessibilityRole.TEXT}
    ${'span'}    | ${'span'}          | ${AccessibilityRole.TEXT}
  `(
    "setTextSemantic($headingLevel) = {accessibilityRole: $accessibilityRole, accessibilityLevel: $accessibilityLevel, dir: 'ltr'}",
    ({ headingLevel, accessibilityLevel, accessibilityRole }) => {
      expect(setTextSemantic(headingLevel)).toEqual({ accessibilityRole, accessibilityLevel })
    }
  )
})
