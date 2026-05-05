// eslint-disable-next-line no-restricted-imports
import FastImage from '@d11/react-native-fast-image'
import Clipboard from '@react-native-clipboard/clipboard'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components/native'

import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo, getSpacing } from 'ui/theme'

interface AssetGridTemplateProps {
  title: string
  icons?: Record<string, React.ComponentType<AccessibleIcon>>
  images?: Record<string, React.ComponentProps<typeof FastImage>['source']>
  isBicolor?: boolean
  isIllustration?: boolean
}

export const AssetGridTemplate: React.FC<AssetGridTemplateProps> = ({
  title,
  icons,
  images,
  isBicolor = false,
  isIllustration = false,
}) => {
  const [copiedAssetName, setCopiedAssetName] = useState<string | null>(null)

  const sortEntriesByName = <T,>(entries: [string, T][]) => {
    return entries.sort(([name1], [name2]) => {
      if (name1 < name2) return -1
      else if (name1 > name2) return 1
      else return 0
    })
  }

  const sortedIcons = useMemo(
    () => (icons ? sortEntriesByName(Object.entries(icons)) : []),
    [icons]
  )
  const sortedImages = useMemo(
    () => (images ? sortEntriesByName(Object.entries(images)) : []),
    [images]
  )

  const handleAssetClick = (assetName: string) => {
    Clipboard.setString(assetName)
    setCopiedAssetName(assetName)
    setTimeout(() => setCopiedAssetName(null), 1000)
  }

  return (
    <React.Fragment>
      <StyledTitle2>{title}</StyledTitle2>
      <GridContainer>
        {sortedIcons.map(([name, Icon]) => {
          const isCopied = copiedAssetName === name
          const IconComponent = styled(Icon).attrs(({ theme }) => ({
            color: theme.designSystem.color.icon.default,
          }))``
          const IconComponentBicolor = styled(Icon).attrs(({ theme }) => ({
            color: theme.designSystem.color.icon.brandPrimary,
          }))``

          return (
            <AssetWrapper
              key={name}
              onPress={() => handleAssetClick(name)}
              isCopied={isCopied}
              isIllustration={isIllustration}>
              {isBicolor ? <IconComponentBicolor /> : <IconComponent />}
              {isCopied ? <StyledTitle4>Copié&nbsp;!</StyledTitle4> : null}
              <StyledBodyS numberOfLines={2}>{name}</StyledBodyS>
            </AssetWrapper>
          )
        })}
        {sortedImages.map(([name, source]) => {
          const isCopied = copiedAssetName === name

          return (
            <AssetWrapper
              key={name}
              onPress={() => handleAssetClick(name)}
              isCopied={isCopied}
              isIllustration={isIllustration}>
              <StyledRasterImage
                source={typeof source === 'string' ? { uri: source } : source}
                resizeMode="contain"
              />
              {isCopied ? <StyledTitle4>Copié&nbsp;!</StyledTitle4> : null}
              <StyledBodyS numberOfLines={2}>{name}</StyledBodyS>
            </AssetWrapper>
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

const AssetWrapper = styled.TouchableOpacity<{
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

const StyledRasterImage = styled(FastImage)({
  width: getSpacing(24),
  height: getSpacing(24),
})
