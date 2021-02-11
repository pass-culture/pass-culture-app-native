import { t } from '@lingui/macro'
import React, { PropsWithChildren } from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

import { Expense } from 'api/gen/api'
import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings'
import { ExpenseV2 } from 'features/profile/components/types'
import { _ } from 'libs/i18n'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, ColorsEnum, Typo, Spacer } from 'ui/theme'

type BeneficiaryHeaderProps = {
  firstName?: string
  lastName?: string
  remainingCredit: number
  depositExpirationDate?: string
} & (
  | {
      depositVersion: 1
      expenses: Array<Expense>
    }
  | {
      depositVersion: 2
      expenses: Array<ExpenseV2>
    }
)

export function BeneficiaryHeader(props: PropsWithChildren<BeneficiaryHeaderProps>) {
  const expenses =
    props.depositVersion === 1
      ? (props.expenses as Array<Expense>)
      : (props.expenses as Array<ExpenseV2>)

  return (
    <Container testID={`beneficiary-header-${props.depositVersion}`}>
      <HeaderBackgroundWrapper>
        <HeaderBackground width={screenWidth} />
      </HeaderBackgroundWrapper>
      <Spacer.Column numberOfSpaces={12} />
      <UserNameAndCredit>
        {/* eslint-disable-next-line react-native/no-raw-text */}
        <Typo.Title4 color={ColorsEnum.WHITE}>{`${props.firstName} ${props.lastName}`}</Typo.Title4>
        <Spacer.Column numberOfSpaces={4.5} />
        {/* eslint-disable-next-line react-native/no-raw-text */}
        <Typo.Hero color={ColorsEnum.WHITE}>{`${props.remainingCredit} €`}</Typo.Hero>
        <Spacer.Column numberOfSpaces={2} />
        {props.depositExpirationDate && (
          <Typo.Caption color={ColorsEnum.WHITE}>
            {_(t`crédit valable jusqu'au ${props.depositExpirationDate}`)}
          </Typo.Caption>
        )}
        <Spacer.Column numberOfSpaces={6} />
      </UserNameAndCredit>
      <Ceilings depositVersion={props.depositVersion} expenses={expenses} />
    </Container>
  )
}

/** Add 1 pixel to avoid 1 white pixel on androids */
const screenWidth = Dimensions.get('window').width + 1

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
