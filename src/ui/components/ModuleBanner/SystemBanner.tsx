import React, { FunctionComponent, ReactElement, useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics/provider'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { getSpacing, TypoDS } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

type Props = {
  LeftIcon: ReactElement
  title: string
  subtitle: string
  onPress: VoidFunction
  accessibilityLabel: string
  analyticsParams: {
    type: 'credit' | 'location'
    from: 'home' | 'thematicHome' | 'offer' | 'profile' | 'search'
  }
}

export const SystemBanner: FunctionComponent<Props> = ({
  LeftIcon,
  title,
  subtitle,
  onPress,
  accessibilityLabel,
  analyticsParams: { type, from },
}) => {
  const focusProps = useHandleFocus()

  useEffect(() => {
    analytics.logSystemBlockDisplayed({ type, from })
  }, [type, from])

  return (
    <StyledTouchable onPress={onPress} accessibilityLabel={accessibilityLabel} {...focusProps}>
      <Container testID="systemBanner">
        {LeftIcon ? <IconContainer>{LeftIcon}</IconContainer> : null}
        <DescriptionContainer gap={1}>
          <TypoDS.BodyAccent>{title}</TypoDS.BodyAccent>
          <TypoDS.Body numberOfLines={2}>{subtitle}</TypoDS.Body>
        </DescriptionContainer>
        <View>
          <StyledArrowNextIcon />
        </View>
      </Container>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)<{ isFocus?: boolean; isHover?: boolean }>(
  ({ theme, isFocus }) => ({
    borderRadius: theme.borderRadius.radius,
    ...customFocusOutline({ isFocus, color: theme.colors.black }),
  })
)

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: theme.borderRadius.radius,
  borderColor: theme.colors.secondaryLight200,
  padding: getSpacing(4),
  width: '100%',
}))

const IconContainer = styled.View({
  alignContent: 'center',
  marginRight: getSpacing(4),
})

const DescriptionContainer = styled(ViewGap)({
  flexShrink: 1,
  flexGrow: 1,
  marginRight: getSpacing(4),
  textAlign: 'start',
})

const StyledArrowNextIcon = styled(ArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  color: theme.colors.secondaryLight200,
}))``
