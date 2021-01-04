import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { useOffer } from 'features/offer/api/useOffer'
import { Rectangle } from 'ui/svg/Rectangle'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

import { getCtaWording } from '../services/getCtaWording'

interface Props {
  offerId: number
}

export const CallToAction: React.FC<Props> = ({ offerId }) => {
  const { data: offer } = useOffer({ offerId })
  const { isLoggedIn } = useAuthContext()
  const { data: profileInfo } = useUserProfileInfo()
  const isBeneficiary = profileInfo?.isBeneficiary || false

  if (!offer) return <React.Fragment></React.Fragment>
  const categoryType = offer.category.categoryType
  const wording = getCtaWording({ categoryType, isLoggedIn, isBeneficiary })

  return (
    <Container onPress={() => null}>
      <Rectangle height={getSpacing(12)} size="100%" />
      <Title adjustsFontSizeToFit numberOfLines={1}>
        {wording}
      </Title>
    </Container>
  )
}

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: BorderRadiusEnum.BUTTON,
  overflow: 'hidden',
})

const Title = styled(Typo.ButtonText)({
  position: 'absolute',
  color: ColorsEnum.WHITE,
  padding: getSpacing(5),
})
