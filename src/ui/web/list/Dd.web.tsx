import styled from 'styled-components'

export const Dd = styled.dd.attrs<{ testID?: string }>(({ testID }) => ({
  ['data-testid']: testID,
}))`
  display: flex;
  flex-direction: column;
  white-space: pre-wrap;
`
