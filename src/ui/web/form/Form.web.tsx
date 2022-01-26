import styled from 'styled-components'

const MaxWidth = styled.form`
  ${({ theme }) => `
    width: 100%;
    max-width: ${theme.forms.maxWidth};
  `}
`

const Flex = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
`

export const Form = { Flex, MaxWidth }
