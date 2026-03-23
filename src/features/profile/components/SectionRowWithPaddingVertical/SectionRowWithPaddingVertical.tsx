import styled from 'styled-components/native'

import { SectionRow } from 'ui/components/SectionRow'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

export const StyledSectionRow = styled(SectionRow).attrs({ iconSize: SECTION_ROW_ICON_SIZE })(
  ({ theme }) => ({ paddingVertical: theme.designSystem.size.spacing.l })
)
