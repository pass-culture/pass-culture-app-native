import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { Page } from 'ui/pages/Page'
import { BrokenConnection as InitialBrokenConnection } from 'ui/svg/BrokenConnection'
import { Bookings } from 'ui/svg/icons/Bookings'
import { Connect } from 'ui/svg/icons/Connect'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const OfflinePage = () => {
  const { isLoggedIn } = useAuthContext()

  return (
    <Container>
      <Content>
        <Spacer.TopScreen />
        <BrokenConnection />
        <StyledViewGap gap={4}>
          <StyledTitle2>Oups, pas de réseau&nbsp;!</StyledTitle2>
          <StyledBody>
            Tu n’es pas connecté à internet. Vérifie ta connexion Wi-Fi ou tes données mobiles.
          </StyledBody>
        </StyledViewGap>
        {isLoggedIn ? (
          <ViewGap gap={8}>
            <TagContainer>
              <Tag Icon={Connect} label="Tes billets sont disponibles hors ligne" />
            </TagContainer>
            <InternalTouchableLink
              as={Button}
              icon={Bookings}
              wording="Voir mes réservations"
              navigateTo={{ screen: 'Bookings' }}
              fullWidth
            />
          </ViewGap>
        ) : null}
        <Spacer.BottomScreen />
      </Content>
    </Container>
  )
}
const StyledViewGap = styled(ViewGap)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))
const BrokenConnection = styled(InitialBrokenConnection).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.fullPage,
}))``

const Container = styled(Page)({
  alignItems: 'center',
})

const StyledTitle2 = styled(Typo.Title2).attrs(() => getHeadingAttrs(1))({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body).attrs(() => getHeadingAttrs(2))({
  textAlign: 'center',
})

const Content = styled.View(({ theme }) => ({
  flexDirection: 'column',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: theme.designSystem.size.spacing.l,
  maxWidth: getSpacing(90),
}))

const TagContainer = styled.View({
  justifyContent: 'center',
  flexDirection: 'row',
})
