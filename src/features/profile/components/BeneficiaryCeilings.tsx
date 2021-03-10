import { t } from '@lingui/macro'
import React from 'react'
import Dash from 'react-native-dash'
import styled from 'styled-components/native'

import { Expense } from 'api/gen'
import { AccordionItem } from 'features/offer/components'
import { CreditCeiling, getCreditCeilingProps } from 'features/profile/components/CreditCeiling'
import { ExpenseV2 } from 'features/profile/components/types'
import { computeRemainingCredit, sortExpenses } from 'features/profile/utils'
import { _ } from 'libs/i18n'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { accordionStyle, GreyContainer, Description } from './reusables'

type BeneficiaryCeilingsProps = {
  walletBalance: number
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

const ceilingsQuestions = {
  v1: _(t`Pourquoi les biens physiques et numériques sont-ils limités ?`),
  v2: _(t`Pourquoi les biens numériques sont-ils limités ?`),
}

const ceilingsDescription = {
  v1: _(
    t`Ces plafonds ont été mis en place pour favoriser la diversification des pratiques culturelles.`
  ),
  v2: _(
    t`Ce plafond a été mis en place pour favoriser la diversification des pratiques culturelles.`
  ),
}

export function BeneficiaryCeilings(props: BeneficiaryCeilingsProps) {
  const question = props.depositVersion === 1 ? ceilingsQuestions.v1 : ceilingsQuestions.v2
  const description =
    _(
      t`Le but du pass Culture est de renforcer tes pratiques culturelles, mais aussi d'en créer de nouvelles.\u0020`
    ) + (props.depositVersion === 1 ? ceilingsDescription.v1 : ceilingsDescription.v2)

  const expenses = sortExpenses(props.depositVersion, props.expenses)

  return (
    <GreyContainer>
      <Spacer.Column numberOfSpaces={6} />
      <Title>{_(t`Tu peux encore dépenser :`)}</Title>
      <Spacer.Column numberOfSpaces={5} />
      <CeilingsRow>
        {expenses.map((expense, index: number) => {
          return (
            <CreditCeiling
              key={index}
              amount={convertCentsToEuros(
                computeRemainingCredit(props.walletBalance, expense.limit, expense.current)
              )}
              limit={convertCentsToEuros(expense.limit)}
              {...getCreditCeilingProps(props.depositVersion, expense)}
            />
          )
        })}
      </CeilingsRow>
      <Spacer.Column numberOfSpaces={6} />
      <Separator dashGap={4} dashLength={1} dashThickness={1} />
      <AccordionItem
        title={<Typo.ButtonText>{question}</Typo.ButtonText>}
        titleStyle={accordionStyle.title}
        bodyStyle={accordionStyle.body}>
        <Description>{description}</Description>
      </AccordionItem>
      <Spacer.Column numberOfSpaces={2} />
    </GreyContainer>
  )
}

const Title = styled(Typo.Title4)({
  paddingHorizontal: getSpacing(4),
})

const CeilingsRow = styled.View({
  paddingHorizontal: getSpacing(3),
  flexDirection: 'row',
  alignItems: 'flex-start',
})

const Separator = styled(Dash)({
  borderRadius: 100,
  overflow: 'hidden',
  width: '99%', // a 100% width put the first dot on the border of the view and a space at the end
  alignSelf: 'center',
})
