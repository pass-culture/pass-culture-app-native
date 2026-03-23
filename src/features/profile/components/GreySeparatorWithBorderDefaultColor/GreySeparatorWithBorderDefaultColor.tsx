import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'

// Use designSystem.color.border.default instead designSystem.separator.default or subtle not visible in light mode because the parent background is grey
export const GreySeparatorWithBorderDefaultColor = styled(Separator.Horizontal).attrs(
  ({ theme }) => ({ color: theme.designSystem.color.border.default })
)``
