import styled from 'styled-components/native'

export const DashedSeparator = styled.View(({ theme }) => ({
  borderBottomColor: theme.colors.black,
  borderBottomWidth: 1,
  borderBottomStyle: 'dashed',
  borderRadius: 100,
  overflow: 'hidden',
  width: '100%',
  alignSelf: 'center',
}))
