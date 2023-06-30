import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Image, Text, TouchableWithoutFeedback, View } from 'react-native'
import styled from 'styled-components/native'
import { AccordionItem } from 'ui/components/AccordionItem'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { AppModal } from 'ui/components/modals/AppModal'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { ColorsEnum } from 'ui/theme/colors'
import { api } from 'api/api'
import { formatToFrenchDecimal } from 'libs/parsers'
import useTravelOptions from 'features/travelOptions/api/useTravelOptions'
import { ImageTile } from 'ui/components/ImageTile'
import TravelPaymentRadio from 'features/travelOptions/components/RadioButton/RadioButton'
import { ModalLoader } from 'features/travelOptions/components/ModalLoader/ModalLoader'
import { SafeAreaView } from 'react-native-safe-area-context'

interface TravelListModalInterface {
  toggleModal: () => void
  onProceed: () => void
  visible: boolean
}

const TravelListModal = ({ toggleModal, visible, onProceed }: TravelListModalInterface) => {
  const [selectedItem, setSelectedItem] = useState('')
  const [accordianStatus, setAccordianStatus] = useState(false)
  const [walletBalance, setWalletBalance] = useState(null)
  const [paymentMode, setPaymentMode] = useState('')
  const [travelOptions, setTravelOptions] = useState([])

  const { data: listArr, loading: isLoading, fetchData } = useTravelOptions()

  const handleClick = async () => {
    await onProceed()
  }

  useEffect(() => {
    async function getUserDetails() {
      fetchData('/travel-options', {
        pickup_location: 'Paris',
        drop_location: 'rennes',
      })
      const { domainsCredit } = await api.getnativev1me()
      if (domainsCredit?.all.remaining) {
        setWalletBalance(formatToFrenchDecimal(domainsCredit?.all?.remaining).match(/\d+/)[0])
        // setWalletBalance(79);
      }
    }

    getUserDetails()
    handlePaymentSelection('Payer en espèces')
  }, [])

  const minBalance = 50

  useEffect(() => {
    if (listArr?.length) {
      toggleItemSelection(listArr[0]['name'])
      setTravelOptions(listArr)
    }
  }, [listArr])

  const travelOptionWrapperStyle = (isSelected: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: isSelected ? 1.2 : 0,
    borderRadius: 12,
    padding: 6,
    // marginTop: 8
  })

  const noteTextStyle = {
    color: ColorsEnum.GREY_DARK,
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

  const renderItem = ({ item }: any) => {
    const isSelected = selectedItem === item.name

    return (
      <View>
        <Touchable
          style={travelOptionWrapperStyle(isSelected)}
          onPress={() => toggleItemSelection(item.name)}>
          <ImageWrapper>
            <ImageTile uri={item.icon} height={50} width={50} />
          </ImageWrapper>
          <TitleText>{item.name}</TitleText>
        </Touchable>
        <Spacer.Column numberOfSpaces={2} />
      </View>
    )
  }

  const toggleItemSelection = (name: string) => {
    if (selectedItem !== name) {
      setSelectedItem(name)
    }
  }

  const customHeader = () => (
    <HeaderTextWrapper>
      {!accordianStatus && <Spacer.Column numberOfSpaces={getSpacing(3)} />}
      <Typo.Body style={{ textAlign: 'center', fontWeight: '700', fontSize: 15 }}>
        {!isLoading ? 'Sélectionnez votre mode de transport ' : 'Recherche'}
      </Typo.Body>
    </HeaderTextWrapper>
  )

  const accordianTitle = () => (
    <AccordianTextWrapper>
      <AccordianText>
        {
          // accordianStatus
          // ? 'Sélectionnez le mode de paiement'
          // :
          'Mode de paiement : Payer en espèces'
          // `Mode de paiement : Portefeuille PC € ${walletBalance}`
        }
      </AccordianText>
    </AccordianTextWrapper>
  )

  const handlePaymentSelection = useCallback((selectedPaymentMode: string) => {
    setPaymentMode(selectedPaymentMode)
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={() => toggleModal()}>
        <View>
          <AppModal
            animationOutTiming={1}
            visible={visible}
            customModalHeader={customHeader()}
            onBackButtonPress={() => toggleModal()}
            scrollEnabled={false}
            onRequestClose={() => toggleModal()}>
            <ModalContent>
              {isLoading ? (
                <LoaderWrapper>
                  <ModalLoader message="Veuillez patienter! Nous recherchons des options de voyage actuelles" />
                </LoaderWrapper>
              ) : (
                <>
                  {paymentMode === 'Portefeuille...' && walletBalance < minBalance && selectedItem && (
                    <ErrorMessageWrapper>
                      <Text style={errorMessageStyle}>
                        {
                          '! Solde du portefeuille insuffisant. Veuillez ajouter un solde minimum de 50 € pour continuer.'
                        }
                      </Text>
                    </ErrorMessageWrapper>
                  )}

                  <Spacer.Column numberOfSpaces={1} />
                  {travelOptions?.length ? (
                    <FlatList
                      data={travelOptions}
                      renderItem={renderItem}
                      scrollEnabled={false}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  ) : (
                    <></>
                  )}
                  <Spacer.Column numberOfSpaces={3} />
                  {selectedItem && (
                    <AccordianWrapper
                      isError={
                        paymentMode === 'Portefeuille...' &&
                        walletBalance < minBalance &&
                        selectedItem
                      }>
                      <AccordionItem
                        title={accordianTitle()}
                        onClose={() => setAccordianStatus(!accordianStatus)}
                        onOpen={() => setAccordianStatus(!accordianStatus)}>
                        <TravelPaymentRadio
                          selectedItem={paymentMode}
                          walletBalance={walletBalance}
                          onPress={(paymentMode) => handlePaymentSelection(paymentMode)}
                        />
                        <NoteContainer>
                          <Text style={noteTextStyle}>
                            {'Le service est actuellement indisponible'}
                          </Text>
                        </NoteContainer>
                      </AccordionItem>
                    </AccordianWrapper>
                  )}
                  <Spacer.Column numberOfSpaces={5} />
                </>
              )}
              <ButtonWithLinearGradient
                wording={'Procéder'}
                onPress={handleClick}
                isDisabled={
                  !selectedItem ||
                  !paymentMode ||
                  !walletBalance ||
                  (paymentMode === 'Portefeuille...' && walletBalance > minBalance)
                }
              />
            </ModalContent>
          </AppModal>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

const ModalContent = styled.View({
  // flex: 1,
  alignContent: 'center',
})

const LoaderWrapper = styled.View({
  paddingHorizontal: getSpacing(10),
})

const ImageWrapper = styled.View({ marginRight: 12 })

const AccordianWrapper = styled.View(({ isError }) => ({
  borderWidth: isError ? 1 : 0.5,
  borderColor: isError ? ColorsEnum.ERROR : ColorsEnum.GREY_MEDIUM,
  borderRadius: 10,
}))

const HeaderTextWrapper = styled.View({
  width: '100%',
})

const AccordianTextWrapper = styled.View({
  flexWrap: 'wrap',
  backGroundCOlor: 'red',
  maxWidth: '100%',
})

const ErrorMessageWrapper = styled.View({
  width: '100%',
})

const NoteContainer = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
  // paddingTop: 5,
  // paddingBottom: 5,
  padding: 10,
  width: '90%',
  backgroundColor: ColorsEnum.GREY_MEDIUM,
  borderRadius: 8,
})

const TitleText = styled.Text({
  fontSize: 15,
  fontWeight: 'bold',
  fontFamily: 'Montserrat',
  color: ColorsEnum.BLACK,
})

const AccordianText = styled.Text({
  fontSize: 13,
  fontWeight: 'Medium',
  fontFamily: 'Montserrat',
  color: ColorsEnum.BLACK,
})

const Touchable = styled.TouchableOpacity({
  flexDirection: 'row',
  alignItems: 'center',
  padding: getSpacing(2),
  borderRadius: 12,
})

export default TravelListModal
