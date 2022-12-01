import styled from 'styled-components'

export const InputLabel = styled.label(({ theme }) => ({
  ...theme.typography?.body,
  cursor: 'pointer',
}))
