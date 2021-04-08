import { t } from '@lingui/macro'
import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen/api'
import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings'
import { computeCredit } from 'features/profile/utils'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, ColorsEnum, Typo, Spacer, ScreenWidth } from 'ui/theme'

type BeneficiaryHeaderProps = {
  firstName?: string | null
  lastName?: string | null
  domainsCredit?: DomainsCredit | null
  depositExpirationDate?: string
}
export function BeneficiaryHeader(props: PropsWithChildren<BeneficiaryHeaderProps>) {
  return (
    <Container testID="beneficiary-header">
      <HeaderBackgroundWrapper>
        <HeaderBackground width={ScreenWidth} />
      </HeaderBackgroundWrapper>
      <Spacer.Column numberOfSpaces={12} />
      <UserNameAndCredit>
        {/* eslint-disable-next-line react-native/no-raw-text */}
        <Typo.Title4 color={ColorsEnum.WHITE}>{`${props.firstName} ${props.lastName}`}</Typo.Title4>
        <Spacer.Column numberOfSpaces={4.5} />
        {/* eslint-disable-next-line react-native/no-raw-text */}
        <Typo.Hero color={ColorsEnum.WHITE}>{`${convertCentsToEuros(
          computeCredit(props.domainsCredit)
        )} €`}</Typo.Hero>
        <Spacer.Column numberOfSpaces={2} />
        {props.depositExpirationDate && (
          <Typo.Caption color={ColorsEnum.WHITE}>
            {t`crédit valable jusqu'au` + `\u00a0${props.depositExpirationDate}`}
          </Typo.Caption>
        )}
        <Spacer.Column numberOfSpaces={6} />
      </UserNameAndCredit>
      <Ceilings domainsCredit={props.domainsCredit} />
    </Container>
  )
}

const Container = styled.View({
  paddingHorizontal: getSpacing(5.5),
})

const HeaderBackgroundWrapper = styled.View({
  position: 'absolute',
  top: 0,
  maxHeight: getSpacing(73.5),
})

const UserNameAndCredit = styled.View({
  alignItems: 'center',
})

const Ceilings = styled(BeneficiaryCeilings)({
  top: getSpacing(42),
})
