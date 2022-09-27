import React from 'react'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo, Spacer, getSpacing } from 'ui/theme'

interface Props {
  icon: React.FunctionComponent<AccessibleIcon>
  title: string
  description?: string
  captionId?: string
  onPress: () => void
}

export const FilterRow = ({ icon: Icon, title, description, captionId, onPress }: Props) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    color: theme.colors.black,
    color2: theme.colors.black,
    size: theme.icons.sizes.small,
  }))``
  return (
    <MarginHorizontalContainer>
      <LocationContentContainer testID="FilterRow" onPress={onPress} aria-describedby={captionId}>
        <StyledIcon />
        <Spacer.Row numberOfSpaces={2} />
        <TextContainer>
          <Title numberOfLines={1}>{title}</Title>
          {!!description && <Description numberOfLines={1}>{description}</Description>}
        </TextContainer>
        <Spacer.Flex />
        <ArrowNext />
      </LocationContentContainer>
    </MarginHorizontalContainer>
  )
}

const MarginHorizontalContainer = styled.View({ marginHorizontal: getSpacing(6) })

const LocationContentContainer = styled(TouchableOpacity)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const TextContainer = styled.View({
  flexDirection: 'column',
  alignItems: 'flex-start',
})

const Title = styled(Typo.ButtonText)({
  flexShrink: 1,
})

const Description = styled(Typo.CaptionNeutralInfo)({
  flexShrink: 1,
})

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
