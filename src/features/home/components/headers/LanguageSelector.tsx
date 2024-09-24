import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Modal } from 'react-native'
import styled from 'styled-components/native'

const flags = {
  en: '🇺🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
}
const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
]

export const LanguageSelector = () => {
  const { t, i18n } = useTranslation()
  const [modalVisible, setModalVisible] = useState(false)
  const currentLanguage = i18n.language
  const currentFlag = flags[currentLanguage] || '🌐'
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setModalVisible(false)
  }
  return (
    <Container>
      {/* Current Language Display with Flag */}
      <CurrentLanguage onPress={() => setModalVisible(true)}>
        <Flag>{currentFlag}</Flag>
        <LanguageText>{t('language')}</LanguageText>
      </CurrentLanguage>
      {/* Modal for Language Selection */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <ModalContainer>
          <ModalContent>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <LanguageOption onPress={() => changeLanguage(item.code)}>
                  <Flag>{flags[item.code]}</Flag>
                  <LanguageLabel>{item.label}</LanguageLabel>
                </LanguageOption>
              )}
            />
            <CloseButton onPress={() => setModalVisible(false)}>
              <CloseText>{t('close')}</CloseText>
            </CloseButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  )
}

const Container = styled.View`
  align-items: flex-start;
  justify-content: center;
  margin-left: 24px;
`
const CurrentLanguage = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-width: 1px;
  border-radius: 5px;
  border-color: #ccc;
`
const Flag = styled.Text`
  font-size: 24px;
  margin-right: 10px;
`
const LanguageText = styled.Text`
  font-size: 14px;
`
const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`
const ModalContent = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
`
const LanguageOption = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: 10px;
`
const LanguageLabel = styled.Text`
  font-size: 18px;
  margin-left: 10px;
`
const CloseButton = styled.TouchableOpacity`
  margin-top: 20px;
  align-self: center;
`
const CloseText = styled.Text`
  color: blue;
  font-size: 16px;
`
