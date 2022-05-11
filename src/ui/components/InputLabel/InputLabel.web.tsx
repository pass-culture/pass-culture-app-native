import styled from 'styled-components'

import { getTextAttrs } from 'ui/theme/typography'

export const InputLabel = styled.label.attrs(getTextAttrs())(({ theme }) => ({
  ...theme.typography?.body,
}))
