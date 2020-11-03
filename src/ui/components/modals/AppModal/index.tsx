import React, { FunctionComponent } from 'react'
import { Modal, TouchableWithoutFeedback, View } from 'react-native'

import { ArrowPrevious } from 'ui/icons/ArrowPrevious'
import { Close } from 'ui/icons/Close'

import ModalHeader from '../ModalHeader'

import { AppModalStyles } from './styles'

interface Props {
  title: string
  visible: boolean
  onClose?: () => void
  onBackNavigation?: () => void
}

const AppModal: FunctionComponent<Props> = ({
  title,
  visible,
  onClose,
  onBackNavigation,
  children,
}) => {
  return (
    <Modal animationType="slide" statusBarTranslucent transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={AppModalStyles.overlay}>
          <TouchableWithoutFeedback>
            <View style={AppModalStyles.container}>
              <ModalHeader
                title={title}
                leftIcon={ArrowPrevious}
                onLeftIconPress={onBackNavigation}
                rightIcon={Close}
                onRightIconPress={onClose}
              />
              <View style={AppModalStyles.content}>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default AppModal
