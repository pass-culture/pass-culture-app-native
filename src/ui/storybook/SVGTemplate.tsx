import Clipboard from '@react-native-clipboard/clipboard'
// eslint-disable-next-line import/no-extraneous-dependencies
import { StoryFn } from '@storybook/react'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components/native'

import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer, Typo, getSpacing } from 'ui/theme'

export const SVGTemplate: StoryFn<
  React.FC<{
    title: string
    icons: Record<string, React.ComponentType<AccessibleIcon>>
    isBicolor?: boolean
    children?: never
    isIllustration?: boolean
  }>
> = ({ title, icons, isBicolor = false, isIllustration = false }) => {
  const [copiedIconName, setCopiedIconName] = useState<string | null>(null)

  const sortedIcons = useMemo(() => {
    return Object.entries(icons).sort(([iconName1], [iconName2]) => {
      if (iconName1 < iconName2) return -1
      else if (iconName1 > iconName2) return 1
      else return 0
    })
  }, [icons])

  const handleIconClick = (iconName: string) => {
    Clipboard.setString(iconName)
    setCopiedIconName(iconName)
    setTimeout(() => setCopiedIconName(null), 1000)
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={3} />
      <Typo.Title2>{title}</Typo.Title2>
      <Spacer.Column numberOfSpaces={3} />
      <GridContainer>
        {sortedIcons.map(([name, Icon]) => {
          const IconComponent = styled(Icon)({})
          const IconComponentBicolor = styled(Icon).attrs(({ theme }) => ({
            color: theme.colors.primary,
            color2: theme.colors.secondary,
          }))``
          const isCopied = copiedIconName === name
          return (
            <IconWrapper
              key={name}
              onPress={() => handleIconClick(name)}
              isCopied={isCopied}
              isIllustration={isIllustration}>
              {isBicolor ? <IconComponentBicolor /> : <IconComponent />}
              {isCopied ? <StyledTitle4>Copié&nbsp;!</StyledTitle4> : null}
              <Spacer.Column numberOfSpaces={2} />
              <Typo.BodyS numberOfLines={2}>{name}</Typo.BodyS>
            </IconWrapper>
          )
        })}
      </GridContainer>
    </React.Fragment>
  )
}

const GridContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
})

const IconWrapper = styled.TouchableOpacity<{
  isCopied: boolean
  isIllustration: boolean
}>(({ theme, isCopied, isIllustration }) => ({
  alignItems: 'center',
  margin: getSpacing(2),
  padding: getSpacing(2),
  width: isIllustration ? getSpacing(60) : getSpacing(40),
  minHeight: isIllustration ? getSpacing(40) : getSpacing(25),
  border: `2px solid ${isCopied ? theme.colors.greenValid : theme.colors.greyLight}`,
  borderRadius: getSpacing(2),
  justifyContent: 'center',
  backgroundColor: isCopied ? theme.colors.greyLight : theme.colors.transparent,
  position: 'relative',
}))

const StyledTitle4 = styled(Typo.Title4)(({ theme }) => ({
  position: 'absolute',
  color: theme.colors.greenValid,
  backgroundColor: theme.colors.white,
  padding: getSpacing(2),
  borderRadius: getSpacing(1),
  zIndex: 1,
}))
