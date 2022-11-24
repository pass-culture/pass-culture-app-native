import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

type GenericBannerProps = {
  LeftIcon?: FunctionComponent<IconInterface>
  tall?: boolean
}

export const GenericBanner: FunctionComponent<GenericBannerProps> = ({
  LeftIcon,
  tall,
  children,
}) => {
  return (
    <Container tall={tall}>
      {!!LeftIcon && (
        <IconContainer>
          <LeftIcon />
        </IconContainer>
      )}
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

const Container = styled(View)<{ tall?: boolean }>(({ theme, tall }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  border: getSpacing(0.25),
  borderRadius: getSpacing(1.8),
  borderColor: theme.colors.greySemiDark,
  paddingHorizontal: getSpacing(4),
  paddingVertical: getSpacing(tall ? 6 : 4),
  width: '100%',
}))

const DescriptionContainer = styled.View({
  flexShrink: 1,
  flexGrow: 1,
  marginRight: getSpacing(4),
  textAlign: 'start',
})

const IconContainer = styled.View({
  alignContent: 'center',
  marginRight: getSpacing(4),
})
