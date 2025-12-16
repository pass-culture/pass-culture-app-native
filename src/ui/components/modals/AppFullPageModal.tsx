import React, { FunctionComponent } from 'react'
import { Modal, useWindowDimensions, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useIsLandscape } from 'shared/useIsLandscape/useIsLandscape'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModal } from 'ui/components/modals/AppModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Clear } from 'ui/svg/icons/Clear'
import { ErrorIllustration } from 'ui/svg/icons/ErrorIllustration'
import { getSpacing, Typo } from 'ui/theme'
import { illustrationSizes } from 'ui/theme/illustrationSizes'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  visible: boolean
  testIdSuffix?: string
  continueProcess: () => void
  quitProcess: () => void
  continueWording: string
  quitWording: string
  title: string
  subtitle: string
}

const BUTTONS_HEIGHT = getSpacing(45)

export const AppFullPageModal: FunctionComponent<Props> = ({
  visible,
  testIdSuffix,
  continueWording,
  quitWording,
  title,
  subtitle,
  quitProcess,
  continueProcess,
}) => {
  const isLandscape = useIsLandscape()
  const theme = useTheme()
  const { isDesktopViewport } = useTheme()
  const { height } = useWindowDimensions()

  return isDesktopViewport ? (
    <Modal
      animationType="fade"
      statusBarTranslucent
      transparent
      visible={visible}
      testID={testIdSuffix ? `modal-${testIdSuffix}` : undefined}
      onRequestClose={continueProcess}>
      <Container>
        <GenericInfoPage
          illustration={ErrorIllustration}
          title={title}
          subtitle={subtitle}
          buttonPrimary={{
            wording: continueWording,
            onPress: continueProcess,
          }}
          buttonTertiary={{
            wording: quitWording,
            onPress: quitProcess,
            icon: Clear,
          }}
        />
      </Container>
    </Modal>
  ) : (
    <AppModal
      title=""
      visible={visible}
      isFullscreen
      testID={testIdSuffix ? `modal-${testIdSuffix}` : undefined}
      customModalHeader={
        <ModalHeaderContainer gap={4} height={height}>
          <ErrorIllustration
            size={isLandscape ? illustrationSizes.medium : illustrationSizes.fullPage}
            color={theme.designSystem.color.icon.brandPrimary}
          />
          <StyledTitle2 {...getHeadingAttrs(1)}>{title}</StyledTitle2>
          <StyledBody {...getHeadingAttrs(2)}>{subtitle} </StyledBody>
        </ModalHeaderContainer>
      }
      fixedModalBottom={
        <BottomWrapper gap={4}>
          <ButtonPrimary wording={continueWording} onPress={continueProcess} />
          <ButtonTertiaryBlack icon={Clear} wording={quitWording} onPress={quitProcess} />
        </BottomWrapper>
      }>
      <View />
    </AppModal>
  )
}

const Container = styled.View(({ theme }) => {
  return {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    maxWidth: theme.appContentWidth,
    backgroundColor: theme.designSystem.color.background.default,
  }
})

const StyledTitle2 = styled(Typo.Title2)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xs,
  textAlign: 'center',
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.designSystem.size.spacing.m,
}))

const BottomWrapper = styled(ViewGap)({
  alignItems: 'center',
})

const ModalHeaderContainer = styled(ViewGap)<{ height: number }>(({ height }) => ({
  height: height - BUTTONS_HEIGHT,
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
}))
