import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

const LABEL_MARGIN_TOP = getSpacing(2)

export const LabelContainer = styled.View(({ theme }) => {
  return {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.checkbox,
    borderWidth: 0,
    maxWidth: getSpacing(40),
    paddingHorizontal: getSpacing(2),
    paddingVertical: getSpacing(1),
    marginTop: LABEL_MARGIN_TOP,
  }
})
