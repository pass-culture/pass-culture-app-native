import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import styled from 'styled-components/native'

import { PageHeader } from 'features/identityCheck/atoms/layout/PageHeader'
import { Background } from 'ui/svg/Background'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

interface Props {
  title: string
  scrollChildren?: React.ReactNode
  fixedBottomChildren?: React.ReactNode
}

export const PageWithHeader = (props: Props) => {
  return (
    <React.Fragment>
      <Background />
      <Spacer.TopScreen />
      <PageHeader title={props.title} />
      <BodyContainer>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <StyledBottomCardContainer keyboardShouldPersistTaps="handled">
            {props.scrollChildren}
            <Spacer.Flex />
          </StyledBottomCardContainer>
        </KeyboardAvoidingView>
        <FixedButtonContainer>
          {props.fixedBottomChildren}
          <Spacer.BottomScreen />
        </FixedButtonContainer>
      </BodyContainer>
    </React.Fragment>
  )
}

const BodyContainer = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
  borderTopLeftRadius: getSpacing(4),
  borderTopRightRadius: getSpacing(4),
  overflow: 'hidden',
  backgroundColor: ColorsEnum.WHITE,
})

const StyledBottomCardContainer = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: getSpacing(6),
    alignItems: 'center',
    display: 'flex',
    backgroundColor: ColorsEnum.WHITE,
    borderTopLeftRadius: getSpacing(4),
    borderTopRightRadius: getSpacing(4),
  },
})({
  height: '100%',
})

const FixedButtonContainer = styled.View(({ theme }) => ({
  alignSelf: 'center',
  alignItems: 'center',
  width: theme.appContentWidth - getSpacing(2 * 6),
  position: 'absolute',
  bottom: getSpacing(6),
}))
