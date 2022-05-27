import styled from 'styled-components'

import { getTextAttrs } from 'ui/theme/typographyAttrs/getTextAttrs'

export const InputLabel = styled.label.attrs(getTextAttrs())(({ theme }) => ({
  ...theme.typography?.body,
}))
