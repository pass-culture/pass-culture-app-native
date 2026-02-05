import React from 'react'
// eslint-disable-next-line no-restricted-imports
import { browserName } from 'react-device-detect'
import { ScrollView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { PageNotFound } from 'ui/svg/icons/PageNotFound'
import { Validate } from 'ui/svg/icons/Validate'
import { Spacer, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'
import { illustrationSizes } from 'ui/theme/illustrationSizes'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { supportedBrowsers } from 'web/supportedBrowsers'

type SupportedBrowsers = typeof supportedBrowsers
type BrowserMessageKey = 'NOT_SUPPORTED' | 'OUTDATED'

const browserMessages: Record<
  BrowserMessageKey,
  (browserName: string) => { title: string; description: string; recommendation: string }
> = {
  NOT_SUPPORTED: (name) => ({
    title: `Oups\u00a0!${LINE_BREAK}${name} n’est pas supporté`,
    description:
      'Ton navigateur ne permet pas d’afficher correctement l’application. Voici ceux que nous recommandons pour profiter pleinement du pass Culture\u00a0:',
    recommendation:
      'Pour profiter pleinement du pass Culture, utilise un navigateur compatible ou mets-le à jour dans tes paramètres.',
  }),
  OUTDATED: (name) => ({
    title: `Oups\u00a0!${LINE_BREAK}${name} n’est pas à jour`,
    description:
      'Ton navigateur n’est pas à jour et l’application ne s’affiche pas correctement. Voici ceux que nous recommandons\u00a0:',
    recommendation:
      'Pour une expérience optimale, mets-le à jour depuis les paramètres et profite pleinement du pass Culture\u00a0!',
  }),
}

export const BrowserNotSupportedPage: React.FC<{
  browserVersion: number
  supportedBrowsers: SupportedBrowsers
  onPress: () => void
}> = ({ browserVersion, supportedBrowsers, onPress }) => {
  const { designSystem } = useTheme()
  const isBrowserSupported = browserName in supportedBrowsers
  const minSupportedVersion = isBrowserSupported ? supportedBrowsers[browserName] : undefined
  const isUpToDate = isBrowserSupported && browserVersion >= (minSupportedVersion ?? 0)

  let messageKey: BrowserMessageKey | null = null
  if (!isBrowserSupported) messageKey = 'NOT_SUPPORTED'
  else if (!isUpToDate) messageKey = 'OUTDATED'
  const message = messageKey ? browserMessages[messageKey](browserName) : null

  return (
    <Root>
      <ContentScroll>
        <IllustrationContainer>
          <PageNotFound
            size={illustrationSizes.fullPage}
            color={designSystem.color.icon.brandPrimary}
          />
        </IllustrationContainer>
        <TextContainer gap={4}>
          <StyledTitle2 {...getHeadingAttrs(1)}>{message?.title}</StyledTitle2>
          <Typo.Body {...getHeadingAttrs(2)}>{message?.description}</Typo.Body>

          <AccessibleUnorderedList
            withPadding
            Separator={<Spacer.Column numberOfSpaces={2} />}
            items={Object.entries(supportedBrowsers).map(([browser, version]) => {
              let displayedMessage = `${browser}`
              if (version > 0) displayedMessage += ` (version ≥ ${version})`
              return (
                <ListContainer key={browser} gap={2}>
                  <ValidateIcon />
                  <Typo.Body>{displayedMessage}</Typo.Body>
                </ListContainer>
              )
            })}
          />

          <Typo.BodyAccentS>{message?.recommendation}</Typo.BodyAccentS>
        </TextContainer>
      </ContentScroll>

      <ButtonContainer>
        <ButtonPrimary wording="Continuer sans mettre à jour" onPress={onPress} numberOfLines={2} />
      </ButtonContainer>
    </Root>
  )
}

const Root = styled.View(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.designSystem.color.background.default,
  alignItems: 'center',
}))

const ContentScroll = styled(ScrollView).attrs(({ theme }) => ({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingTop: theme.contentPage.marginVertical,
    paddingBottom: theme.illustrations.sizes.medium,
  },
}))``

const IllustrationContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.designSystem.size.spacing.m,
}))

const StyledTitle2 = styled(Typo.Title2)({
  textAlign: 'center',
})

const ValidateIcon = styled(Validate).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
  size: theme.icons.sizes.extraSmall,
}))``

const TextContainer = styled(ViewGap)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xxl,
  maxWidth: theme.contentPage.maxWidth,
}))

const ListContainer = styled(ViewGap)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: theme.designSystem.size.spacing.xl,
}))

const ButtonContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  alignItems: 'center',
  width: '100%',
  paddingVertical: theme.contentPage.marginVertical,
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))
