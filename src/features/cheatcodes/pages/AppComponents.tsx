import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import { ScrollView, View, Text, Alert } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { TextInput } from 'ui/components/inputs/TextInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { AppButton, AppButtonTheme } from 'ui/components/buttons/AppButton'
import { useModal } from 'ui/components/modals/useModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Eye } from 'ui/svg/icons/Eye'
import { EyeSlash } from 'ui/svg/icons/EyeSlash'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

function onButtonPress() {
  Alert.alert('you pressed it')
}
function onButtonLongPress() {
  Alert.alert('you long pressed it')
}

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
      <AppButton
        title="Se connecter"
        onPress={onButtonPress}
        buttonTheme={AppButtonTheme.PRIMARY}
        icon={Close}
      />
      <Spacer.Column numberOfSpaces={1} />
      <AppButton
        title="Se connecter"
        onPress={onButtonPress}
        buttonTheme={AppButtonTheme.PRIMARY}
        disabled
      />
      <Spacer.Column numberOfSpaces={1} />
      <AppButton
        title="Custom button long press"
        onPress={onButtonPress}
        onLongPress={onButtonLongPress}
        buttonTheme={AppButtonTheme.PRIMARY}
        customStyles={{
          container: {
            backgroundColor: ColorsEnum.GREEN_VALID,
          },
        }}
        icon={Close}
      />
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Title4>{_(t`Button - Theme Secondary`)}</Typo.Title4>
      <AppButton
        title="Se connecter"
        onPress={onButtonPress}
        buttonTheme={AppButtonTheme.SECONDARY}
        icon={Close}
      />
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Title4>{_(t`Button - Theme Tertiary`)}</Typo.Title4>
      <AppButton
        title="Se connecter"
        onPress={onButtonPress}
        buttonTheme={AppButtonTheme.TERTIARY}
        icon={Close}
      />
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Title4>{_(t`Button - Theme Quaternary`)}</Typo.Title4>
      <AppButton
        title="Se connecter"
        onPress={onButtonPress}
        buttonTheme={AppButtonTheme.QUATERNARY}
        icon={Close}
      />
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
      <AlignedText>
        <Eye size={24} />
        <Text>{_(t` - Eye `)}</Text>
      </AlignedText>
      <AlignedText>
        <EyeSlash size={24} />
        <Text>{_(t` - EyeSlash `)}</Text>
      </AlignedText>
      <Spacer.Column numberOfSpaces={1} />

      {/* Inputs */}
      <Typo.Title1 color={ColorsEnum.PRIMARY}>{_(t`Inputs`)}</Typo.Title1>
      <Typo.Title4 color={ColorsEnum.TERTIARY}>{_(t`Text Input`)}</Typo.Title4>
      <TextInput value="" onChangeText={doNothingFn} placeholder={'Placeholder'} />
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Title4 color={ColorsEnum.TERTIARY}>{_(t`Text Input - Email`)}</Typo.Title4>
      <TextInput
        value=""
        onChangeText={doNothingFn}
        placeholder={'Placeholder'}
        keyboardType="email-address"
      />
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Title4 color={ColorsEnum.TERTIARY}>{_(t`Text Input - Error`)}</Typo.Title4>
      <TextInput value="" onChangeText={doNothingFn} placeholder={'Placeholder'} isError={true} />
      <Spacer.Column numberOfSpaces={1} />
      <Typo.Title4 color={ColorsEnum.TERTIARY}>{_(t`Password Input`)}</Typo.Title4>
      <PasswordInput value="" onChangeText={doNothingFn} placeholder={'Placeholder'} />
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

function doNothingFn() {
  /* do nothing */
}
