import React, { FunctionComponent } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

type GenericBannerProps = {
  LeftIcon?: FunctionComponent<IconInterface>
  RighIcon?: FunctionComponent<IconInterface>
  style?: StyleProp<ViewStyle>
}

export const GenericBanner: FunctionComponent<GenericBannerProps> = ({
  LeftIcon,
  RighIcon,
  style,
  children,
}) => {
  return (
    <View style={[styles.container, style]}>
      {!!LeftIcon && (
        <IconContainer>
          <LeftIcon />
        </IconContainer>
      )}
      <DescriptionContainer>{children}</DescriptionContainer>
      <View>{RighIcon ? <RighIcon /> : <StyledArrowNextIcon />}</View>
    </View>
  )
}

const StyledArrowNextIcon = styled(ArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: getSpacing(0.25),
    borderRadius: getSpacing(1.8),
    borderColor: theme.colors.greySemiDark,
    padding: getSpacing(4),
    width: '100%',
  },
})

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
