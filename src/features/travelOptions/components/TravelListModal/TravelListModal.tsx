import { ModalLoader } from 'features/travelOptions/components/ModalLoader/ModalLoader'
import TravelPaymentRadio from 'features/travelOptions/components/RadioButton/RadioButton'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Image, Text, TouchableWithoutFeedback, View } from 'react-native'
import styled from 'styled-components/native'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { AppModal } from 'ui/components/modals/AppModal'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { ColorsEnum } from 'ui/theme/colors'
import { api } from 'api/api'
import { formatToFrenchDecimal } from 'libs/parsers'

interface TravelListModalProps {
  isLoading: boolean
}

const TravelListModal: React.FC<TravelListModalProps> = ({ isLoading }) => {
  const [modalVisible, setModalVisible] = useState(true)
  const [selectedItem, setSelectedItem] = useState<string | null>('')
  const [accordianStatus, setAccordianStatus] = useState(false)
  const [walletBalance, setWalletBalance] = useState(45)
  const [paymentMode, setPaymentMode] = useState('')
  // const user = await api.getnativev1me()
  useEffect(() => {
    async function getUserDetails() {
      const { domainsCredit } = await api.getnativev1me()
      if (domainsCredit?.all.remaining) {
        setWalletBalance(formatToFrenchDecimal(domainsCredit?.all.remaining).match(/\d+/)[0])
      }

      // setWalletBalance()
    }
    getUserDetails()
    toggleItemSelection('1')
    handlePaymentSelection('Portefeuille...')
  }, [])

  const minBalance = 50

  // Example data for the list

  const data = [
    {
      id: '1',
      image: require('../../asssets/taxi.png'),
      title: 'Trajets en taxi',
    },
    {
      id: '2',
      image: require('../../asssets/metro.png'),
      title: 'Horaires des trains',
    },
    {
      id: '3',
      image: require('../../asssets/bus.png'),
      title: 'Horaires de bus',
    },
    {
      id: '4',
      image: require('../../asssets/car.png'),
      title: 'Covoiturage',
    },
  ]

  const acordianTitleStyle = {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    color: ColorsEnum.BLACK,
  }

  const travelOptionWrapperStyle = (isSelected: boolean) => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      // marginBottom: 10,
      borderWidth: isSelected ? 1.2 : 0,
      borderRadius: 12,
      padding: 6,
    }
  }

  const noteTextStyle = {
    color: ColorsEnum.GREY,
    fontSize: 12,
    fontFamily: 'Montserrat',
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
  }

  const errorMessageStyle = {
    color: ColorsEnum.ERROR,
    fontSize: 12,
    fontFamily: 'Montserrat',
    fontWeight: '500',
    textAlign: 'center',
  }

  const imageStyle = {
    borderWidth: 1,
    borderColor: ColorsEnum.GREY,
    borderRadius: 10,
    marginRight: 12,
  }

  const renderItem = ({ item }: any) => {
    const isSelected = selectedItem === (item.id || 1)

    return (
      <Touchable
        style={travelOptionWrapperStyle(isSelected)}
        onPress={() => toggleItemSelection(item.id)}>
        <ImageWrapper>
          <Image source={item.image} style={imageStyle} />
        </ImageWrapper>
        <Typo.Title4>{item.title}</Typo.Title4>
      </Touchable>
    )
  }

  const toggleItemSelection = (itemId: any) => {
    if (selectedItem !== itemId) {
      setSelectedItem(itemId)
    }
  }

  const customHeader = () => {
    return (
      <HeaderTextWrapper>
        <Typo.Body style={{ textAlign: 'center' }}>
          {!isLoading ? 'Sélectionnez votre mode de transport' : 'Recherche'}
        </Typo.Body>
      </HeaderTextWrapper>
    )
  }

  const accordianTitle = () => {
    return (
      <AccordianTextWrapper>
        <Typo.Body style={acordianTitleStyle}>
          {accordianStatus
            ? 'Sélectionnez le mode de paiement'
            : `Mode de paiement : Portefeuille PC € ${walletBalance}`}
        </Typo.Body>
      </AccordianTextWrapper>
    )
  }

  const handlePaymentSelection = useCallback((selectedPaymentMode: string) => {
    setPaymentMode(selectedPaymentMode)
  }, [])

  return (
    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
      <View>
        <AppModal
          animationOutTiming={1}
          visible={modalVisible}
          customModalHeader={customHeader()}
          onBackdropPress={() => setModalVisible(false)}
          onRequestClose={() => setModalVisible(false)}>
          <ModalContent>
            {isLoading ? (
              <LoaderWrapper>
                <ModalLoader message="Veuillez patienter! Nous recherchons des options de voyage actuelles" />
              </LoaderWrapper>
            ) : (
              <>
                {walletBalance && walletBalance < minBalance && selectedItem && (
                  <ErrorMessageWrapper>
                    <Text style={errorMessageStyle}>
                      {
                        '! Solde du portefeuille insuffisant. Veuillez ajouter un solde minimum de 50 € pour continuer.'
                      }
                    </Text>
                  </ErrorMessageWrapper>
                )}

                <Spacer.Column numberOfSpaces={3} />
                <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id} />
                <Spacer.Column numberOfSpaces={3} />
                {selectedItem && (
                  <AccordianWrapper
                    isError={walletBalance && walletBalance < minBalance && selectedItem}>
                    <AccordionItem
                      title={accordianTitle()}
                      onPress={() => setAccordianStatus(!accordianStatus)}>
                      <TravelPaymentRadio
                        selectedItem={paymentMode}
                        walletBalance={walletBalance}
                        onPress={(paymentMode: string) => handlePaymentSelection(paymentMode)}
                      />
                      <NoteContainer>
                        <Text style={noteTextStyle}>
                          {'Le service est actuellement indisponible'}
                        </Text>
                      </NoteContainer>
                    </AccordionItem>
                  </AccordianWrapper>
                )}
                <Spacer.Column numberOfSpaces={3} />
              </>
            )}
            <ButtonWithLinearGradient
              wording={'Procéder'}
              isDisabled={
                !selectedItem || !paymentMode || !walletBalance || !(walletBalance > minBalance)
              }
            />
          </ModalContent>
        </AppModal>
      </View>
    </TouchableWithoutFeedback>
  )
}

const ModalContent = styled.View({
  alignContent: 'center',
})

const LoaderWrapper = styled.View({
  paddingHorizontal: getSpacing(10),
})

const ImageWrapper = styled.View({})

const AccordianWrapper = styled.View(({ isError }: any) => ({
  borderWidth: isError ? 1 : 0.5,
  borderColor: isError ? ColorsEnum.ERROR : ColorsEnum.GREY_MEDIUM,
  borderRadius: 10,
}))

const HeaderTextWrapper = styled.View({
  width: '100%',
})

const AccordianTextWrapper = styled.View({
  width: '100%',
})

const ErrorMessageWrapper = styled.View({
  width: '100%',
})

const NoteContainer = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 5,
  paddingBottom: 5,
  width: '90%',
  backgroundColor: ColorsEnum.GREY_LIGHT,
  borderRadius: 12,
})

export default TravelListModal
