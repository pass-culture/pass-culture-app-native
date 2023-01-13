import styled from 'styled-components'

export const InputLabel = styled.label.attrs<{ accessibilityDescribedBy?: string }>(
  ({ accessibilityDescribedBy }) => ({
    ['aria-describedby']: accessibilityDescribedBy,
  })
)(({ theme }) => ({
  ...theme.typography?.body,
  cursor: 'pointer',
}))
