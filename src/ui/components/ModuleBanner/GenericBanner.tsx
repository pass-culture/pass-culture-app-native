import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

type GenericBannerProps = {
  LeftIcon: FunctionComponent<IconInterface>
}

export const GenericBanner: FunctionComponent<GenericBannerProps> = ({ LeftIcon, children }) => {
  return (
    <Container>
      <IconContainer>
        <LeftIcon />
      </IconContainer>
      <DescriptionContainer>{children}</DescriptionContainer>
      <View>
        <StyledArrowNextIcon />
      </View>
    </Container>
  )
}

const StyledArrowNextIcon = styled(ArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const Container = styled(View)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  border: getSpacing(0.25),
  borderRadius: getSpacing(1.8),
  borderColor: theme.colors.greySemiDark,
  paddingHorizontal: getSpacing(4),
  padding: getSpacing(4),
  width: '100%',
}))

const DescriptionContainer = styled.View({
  flexShrink: 1,
  flexGrow: 1,
  marginHorizontal: getSpacing(4),
  textAlign: 'start',
})

const IconContainer = styled.View({
  alignContent: 'center',
})
