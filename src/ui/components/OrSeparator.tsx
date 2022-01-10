import { t } from '@lingui/macro'
import React from 'react'
import { ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, Typo, getSpacing } from 'ui/theme'

interface OrSeparatorProps extends ViewProps {
  lineColor?: ColorsEnum
}

export const OrSeparator: React.FC<OrSeparatorProps> = ({ lineColor, ...props }) => {
  return (
    // @ts-ignore TODO: fix when https://github.com/necolas/react-native-web/issues/2189#issuecomment-1008886405 is resolved
    <Container {...props}>
      <Line color={lineColor} />
      <TextContainer>
        <OrText>{t`ou`}</OrText>
      </TextContainer>
    </Container>
  )
}

const Container = styled.View({
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: getSpacing(6),
  alignSelf: 'stretch',
})

const Line = styled.View.attrs<{ color?: ColorsEnum }>((props) => props)<{ color?: ColorsEnum }>(
  ({ color, theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: color ?? theme.colors.greyMedium,
  })
)

const TextContainer = styled.View(({ theme }) => ({
  paddingHorizontal: 10,
  backgroundColor: theme.colors.white,
}))

const OrText = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.black,
}))
