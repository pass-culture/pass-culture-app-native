import React from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer, getSpacing, TypoDS } from 'ui/theme'

interface Props {
  icon?: React.FunctionComponent<AccessibleIcon>
  title: string
  description?: string
  captionId?: string
  onPress: VoidFunction
  shouldColorIcon?: boolean
  complement?: string
}

export const FilterRow = ({
  icon: Icon,
  title,
  description,
  captionId,
  onPress,
  shouldColorIcon,
  complement,
}: Props) => {
  const StyledIcon = Icon
    ? styled(Icon).attrs(({ theme }) => ({
        color: shouldColorIcon ? theme.colors.primary : theme.colors.black,
        color2: shouldColorIcon ? theme.colors.secondary : theme.colors.black,
        size: theme.icons.sizes.small,
      }))``
    : undefined

  return (
    <TouchableRow testID="FilterRow" onPress={onPress} accessibilityDescribedBy={captionId}>
      {StyledIcon ? (
        <React.Fragment>
          <StyledIcon />
          <Spacer.Row numberOfSpaces={2} />
        </React.Fragment>
      ) : null}
      <TextContainer>
        <TitleAndComplement>
          <Title numberOfLines={2}>{title}</Title>
          {complement ? (
            <ComplementContainer>
              <ComplementLabel numberOfLines={1}>{complement}</ComplementLabel>
            </ComplementContainer>
          ) : null}
        </TitleAndComplement>
        {description ? <Description numberOfLines={1}>{description}</Description> : null}
      </TextContainer>
      <ArrowNext accessibilityLabel="Affiner la recherche" />
    </TouchableRow>
  )
}

const TouchableRow = styledButton(Touchable)({
  flexDirection: 'row',
  alignItems: 'center',
})

const TitleAndComplement = styled.View({
  flexDirection: 'row',
})

const Title = styled(TypoDS.BodyAccent)({
  flexShrink: 1,
})

const Description = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  flexShrink: 1,
  color: theme.colors.greyDark,
}))

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const TextContainer = styled.View({
  flex: 1,
  alignItems: 'flex-start',
})

const ComplementContainer = styled.View({
  flexShrink: 0,
  justifyContent: 'center',
  marginLeft: getSpacing(1),
})

const ComplementLabel = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
