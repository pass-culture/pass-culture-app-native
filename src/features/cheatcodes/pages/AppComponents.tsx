import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { AppModal } from 'ui/components/modals/AppModal'
import { useModal } from 'ui/components/modals/useModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

export const AppComponents: FunctionComponent = () => {
  const {
    visible: basicModalVisible,
    showModal: showBasicModal,
    hideModal: hideBasicModal,
  } = useModal(false)

  return (
    <StyledScrollView>
      {/* Typos */}
      <Typo.Title1 color={ColorsEnum.PRIMARY}>{_(t`Typos`)}</Typo.Title1>

      <Typo.Hero>{_(t`Hero`)}</Typo.Hero>
      <Typo.Title1>{_(t`Title 1`)}</Typo.Title1>
      <Typo.Title2>{_(t`Title 2`)}</Typo.Title2>
      <Typo.Title3>{_(t`Title 3`)}</Typo.Title3>
      <Typo.Title4>{_(t`Title 4`)}</Typo.Title4>
      <Typo.Body>{_(t`This is a body`)}</Typo.Body>
      <Typo.ButtonText>{_(t`This is a button text`)}</Typo.ButtonText>
      <Typo.Caption>{_(t`This is a caption`)}</Typo.Caption>
      <Spacer.Column numberOfSpaces={5} />

      {/* Buttons */}
      <Typo.Title1 color={ColorsEnum.PRIMARY}>{_(t`Buttons`)}</Typo.Title1>
      <Typo.Title4>{_(t`Button - Theme Primary`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Title4>{_(t`Button - Theme Secondary`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Title4>{_(t`Button - Theme Tertiary`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Title4>{_(t`Button - Theme Quaternary`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={5} />

      {/* Inputs */}
      <Typo.Title1 color={ColorsEnum.PRIMARY}>{_(t`Inputs`)}</Typo.Title1>
      <Typo.Title4>{_(t`Input - Any string`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Title4>{_(t`Input - Email input`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Title4>{_(t`Input - Email password`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={5} />

      {/* Modals */}
      <Typo.Title1 color={ColorsEnum.PRIMARY}>{_(t`Modals`)}</Typo.Title1>
      <TouchableOpacity onPress={showBasicModal}>
        <Typo.Title4 color={ColorsEnum.TERTIARY}>{_(t`Modal - Basic`)}</Typo.Title4>
      </TouchableOpacity>
      <AppModal
        title="a basic modal"
        visible={basicModalVisible}
        onClose={hideBasicModal}
        onBackNavigation={hideBasicModal}>
        <Text>An simple content</Text>
      </AppModal>
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Title4>{_(t`Modal - Progressive`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={5} />

      {/* Icons */}
      <Typo.Title1 color={ColorsEnum.PRIMARY}>{_(t`Icons`)}</Typo.Title1>
      <AlignedText>
        <ArrowPrevious size={24} />
        <Text>{_(t` - ArrowPrevious `)}</Text>
      </AlignedText>
      <AlignedText>
        <Close size={24} />
        <Text>{_(t` - Close `)}</Text>
      </AlignedText>
      <Spacer.Column numberOfSpaces={1} />
      <Spacer.Column numberOfSpaces={5} />

      {/* Create your category */}
      <Typo.Title1 color={ColorsEnum.PRIMARY}>{_(t`Add components`)}</Typo.Title1>
      <Spacer.Column numberOfSpaces={5} />
    </StyledScrollView>
  )
}

const AlignedText = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledScrollView = styled(ScrollView)({
  padding: 20,
})
