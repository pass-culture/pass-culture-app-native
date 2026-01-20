import Clipboard from '@react-native-clipboard/clipboard'
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useMemo, useState } from 'react'
import styled from 'styled-components/native'

import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo, getSpacing } from 'ui/theme'

interface SVGTemplateProps {
  title: string
  icons: Record<string, React.ComponentType<AccessibleIcon>>
  isBicolor?: boolean
  children?: never
  isIllustration?: boolean
}

export const SVGTemplate: React.FC<SVGTemplateProps> = ({
  title,
  icons,
  isBicolor = false,
  isIllustration = false,
}) => {
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
      <StyledTitle2>{title}</StyledTitle2>
      <GridContainer>
        {sortedIcons.map(([name, Icon]) => {
          const IconComponent = styled(Icon).attrs(({ theme }) => ({
            color: theme.designSystem.color.icon.default,
          }))``
          const IconComponentBicolor = styled(Icon).attrs(({ theme }) => ({
            color: theme.designSystem.color.icon.brandPrimary,
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
              <StyledBodyS numberOfLines={2}>{name}</StyledBodyS>
            </IconWrapper>
          )
        })}
      </GridContainer>
    </React.Fragment>
  )
}

const StyledTitle2 = styled(Typo.Title2)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.m,
}))

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
  margin: theme.designSystem.size.spacing.s,
  padding: theme.designSystem.size.spacing.s,
  width: isIllustration ? getSpacing(60) : getSpacing(40),
  minHeight: isIllustration ? getSpacing(40) : getSpacing(25),
  border: `2px solid ${isCopied ? theme.designSystem.color.border.success : theme.designSystem.color.border.subtle}`,
  borderRadius: theme.designSystem.size.borderRadius.m,
  justifyContent: 'center',
  backgroundColor: isCopied
    ? theme.designSystem.color.background.success
    : theme.designSystem.color.background.default,
  position: 'relative',
}))

const StyledTitle4 = styled(Typo.Title4)(({ theme }) => ({
  position: 'absolute',
  color: theme.designSystem.color.text.success,
  backgroundColor: theme.designSystem.color.background.default,
  padding: theme.designSystem.size.spacing.s,
  borderRadius: theme.designSystem.size.borderRadius.s,
  zIndex: 1,
}))

const StyledBodyS = styled(Typo.BodyS)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
}))
