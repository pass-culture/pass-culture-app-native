/* eslint-disable react-native/no-raw-text */
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useState } from 'react'
import { ScrollView, View, Text, Alert, Button } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { CategoryNameEnum, Expense, ExpenseDomain } from 'api/gen/api'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { AccordionItem, CallToAction } from 'features/offer/components'
import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings'
import { NonBeneficiaryHeader } from 'features/profile/components/NonBeneficiaryHeader'
import { SectionRow } from 'features/profile/components/SectionRow'
import { ExpenseV2 } from 'features/profile/components/types'
import { SelectionLabel } from 'features/search/atoms/SelectionLabel'
import { CATEGORY_CRITERIA } from 'libs/algolia/enums'
import { mapCategoryToIcon } from 'libs/parsers'
import { Banner, BannerType } from 'ui/components/Banner'
import { ProgressBar } from 'ui/components/bars/ProgressBar'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonQuaternary } from 'ui/components/buttons/ButtonQuaternary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'
import FilterSwitch from 'ui/components/FilterSwitch'
import { DateInput } from 'ui/components/inputs/DateInput'
import { PartialDateInput, DatePartType } from 'ui/components/inputs/PartialDateInput'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { InputRule } from 'ui/components/inputs/rules/InputRule'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Slider } from 'ui/components/inputs/Slider'
import { TextInput } from 'ui/components/inputs/TextInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { StepDots } from 'ui/components/StepDots'
import { AroundMe } from 'ui/svg/icons/AroundMe'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Bell } from 'ui/svg/icons/Bell'
import { BicolorBookings } from 'ui/svg/icons/BicolorBookings'
import { BicolorFavorite } from 'ui/svg/icons/BicolorFavorite'
import { BicolorLocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { BicolorSearch } from 'ui/svg/icons/BicolorSearch'
import { BicolorSelector } from 'ui/svg/icons/BicolorSelector'
import { Booking } from 'ui/svg/icons/Booking'
import { Calendar } from 'ui/svg/icons/Calendar'
import { Check } from 'ui/svg/icons/Check'
import { Clock } from 'ui/svg/icons/Clock'
import { Close } from 'ui/svg/icons/Close'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { Digital } from 'ui/svg/icons/Digital'
import { Email } from 'ui/svg/icons/Email'
import { Everywhere } from 'ui/svg/icons/Everywhere'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { Eye } from 'ui/svg/icons/Eye'
import { EyeSlash } from 'ui/svg/icons/EyeSlash'
import { Favourite } from 'ui/svg/icons/Favourite'
import { HandicapAudio } from 'ui/svg/icons/HandicapAudio'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { HandicapMotor } from 'ui/svg/icons/HandicapMotor'
import { HandicapVisual } from 'ui/svg/icons/HandicapVisual'
import { HappyFaceStars } from 'ui/svg/icons/HappyFaceStars'
import { Info } from 'ui/svg/icons/Info'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { LifeBuoy } from 'ui/svg/icons/LifeBuoy'
import { LocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { LocationPointerNotFilled } from 'ui/svg/icons/LocationPointerNotFilled'
import { Lock } from 'ui/svg/icons/Lock'
import { Logo } from 'ui/svg/icons/Logo'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { OfferDigital } from 'ui/svg/icons/OfferDigital'
import { OfferOutings } from 'ui/svg/icons/OfferOutings'
import { OfferOutingsPhysical } from 'ui/svg/icons/OfferOutingsPhysical'
import { OfferPhysical } from 'ui/svg/icons/OfferPhysical'
import { OrderPrice } from 'ui/svg/icons/OrderPrice'
import { Profile } from 'ui/svg/icons/Profile'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { SadFace } from 'ui/svg/icons/SadFace'
import { SignOut } from 'ui/svg/icons/SignOut'
import { TicketBooked } from 'ui/svg/icons/TicketBooked'
import { UserCircle } from 'ui/svg/icons/UserCircle'
import { Validate } from 'ui/svg/icons/Validate'
import { Warning } from 'ui/svg/icons/Warning'
import { OfferBackPlaceholder } from 'ui/svg/OfferBackPlaceholder'
import { Rectangle } from 'ui/svg/Rectangle'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

function onButtonPress() {
  Alert.alert('you pressed it')
}

const NUMBER_OF_STEPS = 4
const THIS_YEAR = new Date().getFullYear()

const expenses_v1: Array<Expense> = [
  { current: 100, domain: ExpenseDomain.All, limit: 500 },
  { current: 50, domain: ExpenseDomain.Digital, limit: 100 },
  { current: 50, domain: ExpenseDomain.Physical, limit: 200 },
]

const expenses_v2: Array<ExpenseV2> = [
  { current: 150, domain: ExpenseDomain.All, limit: 300 },
  { current: 100, domain: ExpenseDomain.Digital, limit: 200 },
]

export const AppComponents: FunctionComponent = () => {
  const {
    visible: basicModalVisible,
    showModal: showBasicModal,
    hideModal: hideBasicModal,
  } = useModal(false)

  const [buttonIsLoading, setButtonIsLoading] = useState(false)
  const [_partialDate, setPartialDate] = useState('')
  const [inputText, setInputText] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [year, setYear] = useState(THIS_YEAR - 18)

  const onTriggerFakeLoading = useCallback(() => {
    setButtonIsLoading(true)
    setTimeout(() => setButtonIsLoading(false), 3000)
  }, [])

  const { displaySuccessSnackBar, displayInfosSnackBar, hideSnackBar } = useSnackBarContext()
  const popupSnackBarSuccess = useCallback(
    () =>
      displaySuccessSnackBar({
        message: 'Ton mot de passe est modifié, attends 5 secondes !!!',
        timeout: 5000,
      }),
    []
  )
  const popupSnackBarInfos = useCallback(
    () =>
      displayInfosSnackBar({
        message: 'This is a warning !!!',
        onClose: hideSnackBar,
      }),
    []
  )

  const { goBack } = useNavigation<UseNavigationType>()

  return (
    <StyledScrollView>
      <Spacer.TopScreen />
      <ModalHeader title="App components" leftIcon={ArrowPrevious} onLeftIconPress={goBack} />

      {/* Typos */}
      <AccordionItem title="Typos">
        <Typo.Hero>Hero</Typo.Hero>
        <Typo.Title1>Title 1</Typo.Title1>
        <Typo.Title2>Title 2</Typo.Title2>
        <Typo.Title3>Title 3</Typo.Title3>
        <Typo.Title4>Title 4</Typo.Title4>
        <Typo.Body>This is a body</Typo.Body>
        <Typo.ButtonText>This is a button text</Typo.ButtonText>
        <Typo.Caption>This is a caption</Typo.Caption>
      </AccordionItem>

      <Divider />

      {/* Buttons */}
      <AccordionItem title="Buttons">
        {/* Buttons: Primary */}
        <Typo.Title4>Button - Theme Primary</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <ButtonPrimary
          title="Longpress to see"
          onPress={onButtonPress}
          onLongPress={onTriggerFakeLoading}
          icon={Close}
          isLoading={buttonIsLoading}
        />
        <Spacer.Column numberOfSpaces={1} />
        <ButtonPrimary title="Disabled" onPress={onButtonPress} icon={Close} disabled />
        <Spacer.Column numberOfSpaces={2} />
        {/* Buttons: White Primary */}
        <Typo.Title4>Button - White Primary Secondary</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <ButtonPrimaryWhite
          title="White button"
          onPress={onTriggerFakeLoading}
          isLoading={buttonIsLoading}
          icon={Close}
        />
        <Spacer.Column numberOfSpaces={1} />
        <ButtonPrimaryWhite title="Disabled" onPress={onButtonPress} icon={Close} disabled />
        <Spacer.Column numberOfSpaces={2} />
        {/* Buttons: Secondary */}
        <Typo.Title4>Button - Theme Secondary</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <ButtonSecondary
          title="Triggers all active buttons"
          icon={Close}
          isLoading={buttonIsLoading}
          onPress={onTriggerFakeLoading}
        />
        <Spacer.Column numberOfSpaces={1} />
        <ButtonSecondary title="Disabled" icon={Close} disabled onPress={onButtonPress} />
        <Spacer.Column numberOfSpaces={2} />
        {/* Buttons: Tertiary */}
        <Typo.Title4>Button - Theme Tertiary</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <ButtonTertiary
          title="Triggers all active buttons"
          icon={Close}
          isLoading={buttonIsLoading}
          onPress={onTriggerFakeLoading}
        />
        <Spacer.Column numberOfSpaces={1} />
        <ButtonTertiary title="Disabled" onPress={onButtonPress} icon={Close} disabled />
        <Spacer.Column numberOfSpaces={1} />
        <ButtonTertiaryWhite
          title="White tertiary button"
          icon={Close}
          isLoading={buttonIsLoading}
          onPress={onTriggerFakeLoading}
        />
        <Spacer.Column numberOfSpaces={2} />
        {/* Buttons: Quaternary */}
        <Typo.Title4>Button - Theme Quaternary</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <ButtonQuaternary
          title="Triggers all active buttons"
          icon={Close}
          isLoading={buttonIsLoading}
          onPress={onTriggerFakeLoading}
        />
        <Spacer.Column numberOfSpaces={1} />
        <ButtonQuaternary title="Se connecter" onPress={onButtonPress} icon={Close} disabled />
        <CallToAction wording="CallToAction" onPress={onButtonPress} isDisabled={false} />
        <Spacer.Column numberOfSpaces={1} />
        <CallToAction wording="Disabled CallToAction" onPress={undefined} isDisabled={false} />
      </AccordionItem>

      <Divider />

      {/* Modals */}
      <AccordionItem title="Modals">
        <TouchableOpacity onPress={showBasicModal}>
          <Typo.Title4 color={ColorsEnum.TERTIARY}>Modal - Basic</Typo.Title4>
        </TouchableOpacity>
        <AppModal
          title="a basic modal"
          visible={basicModalVisible}
          leftIcon={ArrowPrevious}
          onLeftIconPress={hideBasicModal}
          rightIcon={Close}
          onRightIconPress={hideBasicModal}>
          <Text>A simple content</Text>
        </AppModal>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Title4>Modal - Progressive</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Title4>Modal Header</Typo.Title4>
        <ModalHeader title="My modal header" leftIcon={ArrowPrevious} rightIcon={Close} />
      </AccordionItem>

      <Divider />

      {/* Icons */}
      <AccordionItem title="Icons">
        <CategoryIcons />
        <AlignedText>
          <ArrowPrevious size={24} />
          <Text> - ArrowPrevious </Text>
        </AlignedText>
        <AlignedText>
          <ArrowNext size={24} />
          <Text> - ArrowNext </Text>
        </AlignedText>
        <AlignedText>
          <Check size={24} />
          <Text> - Check </Text>
        </AlignedText>
        <AlignedText>
          <Clock size={24} />
          <Text> - Clock </Text>
        </AlignedText>
        <AlignedText>
          <Close size={24} />
          <Text> - Close </Text>
        </AlignedText>
        <AlignedText>
          <Eye size={24} />
          <Text> - Eye </Text>
        </AlignedText>
        <AlignedText>
          <EyeSlash size={24} />
          <Text> - EyeSlash </Text>
        </AlignedText>
        <AlignedText>
          <Logo size={24} />
          <Text> - Logo </Text>
        </AlignedText>
        <AlignedText>
          <BicolorLogo size={24} />
          <Text> - BicolorLogo </Text>
        </AlignedText>
        <AlignedText>
          <BicolorSearch size={24} />
          <Text> - BicolorSearch </Text>
        </AlignedText>
        <AlignedText>
          <BicolorBookings size={24} />
          <Text> - BicolorBookings </Text>
        </AlignedText>
        <AlignedText>
          <BicolorFavorite size={24} />
          <Text> - BicolorFavorite </Text>
        </AlignedText>
        <AlignedText>
          <BicolorProfile size={24} />
          <Text> - BicolorProfile </Text>
        </AlignedText>
        <AlignedText>
          <BicolorSelector width={24} />
          <Text> - BicolorSelector </Text>
        </AlignedText>
        <AlignedText>
          <UserCircle size={24} />
          <Text> - UserCircle </Text>
        </AlignedText>
        <AlignedText>
          <Email size={24} />
          <Text> - Email </Text>
        </AlignedText>
        <AlignedText>
          <ExternalSite size={24} />
          <Text> - External site </Text>
        </AlignedText>
        <AlignedText>
          <Warning size={24} />
          <Text> - Warning </Text>
        </AlignedText>
        <AlignedText>
          <SadFace size={24} />
          <Text> - SadFace </Text>
        </AlignedText>
        <AlignedText>
          <HappyFaceStars size={40} />
          <Text> - HappyFaceStars </Text>
        </AlignedText>
        <AlignedText>
          <LocationPointer size={24} />
          <Text> - LocationPointer </Text>
        </AlignedText>
        <AlignedText>
          <Digital size={24} />
          <Text> - Digital </Text>
        </AlignedText>
        <AlignedText>
          <OrderPrice size={24} />
          <Text> - OrderPrice </Text>
        </AlignedText>
        <AlignedText>
          <HandicapVisual size={24} />
          <Text> - HandicapVisual </Text>
        </AlignedText>
        <AlignedText>
          <HandicapMental size={24} />
          <Text> - HandicapMental </Text>
        </AlignedText>
        <AlignedText>
          <HandicapMotor size={24} />
          <Text> - HandicapMotor </Text>
        </AlignedText>
        <AlignedText>
          <HandicapAudio size={24} />
          <Text> - HandicapAudio </Text>
        </AlignedText>
        <AlignedText>
          <Validate size={24} />
          <Text> - Validate </Text>
        </AlignedText>
        <AlignedText>
          <Invalidate size={24} />
          <Text> - Invalidate </Text>
        </AlignedText>
        <AlignedText>
          <Favourite size={24} />
          <Text> - Favourite </Text>
        </AlignedText>
        <AlignedText>
          <MagnifyingGlass size={24} />
          <Text> - MagnifyingGlass </Text>
        </AlignedText>
        <AlignedText>
          <Info size={24} />
          <Text> - Info </Text>
        </AlignedText>
        <AlignedText>
          <AroundMe size={24} />
          <Text> - AroundMe </Text>
        </AlignedText>
        <AlignedText>
          <Everywhere size={24} />
          <Text> - Everywhere </Text>
        </AlignedText>
        <AlignedText>
          <BicolorLocationPointer size={24} />
          <Text> - BicolorLocationPointer </Text>
        </AlignedText>
        <AlignedText>
          <NoOffer size={24} />
          <Text> - NoOffer </Text>
        </AlignedText>
        <AlignedText>
          <OfferDigital size={24} />
          <Text> - OfferDigital </Text>
        </AlignedText>
        <AlignedText>
          <OfferPhysical size={24} />
          <Text> - OfferPhysical </Text>
        </AlignedText>
        <AlignedText>
          <OfferOutings size={24} />
          <Text> - OfferOutings </Text>
        </AlignedText>
        <AlignedText>
          <OfferOutingsPhysical size={24} />
          <Text> - OfferOutingsPhysical </Text>
        </AlignedText>
        <AlignedText>
          <LegalNotices size={24} />
          <Text> - LegalNotices </Text>
        </AlignedText>
        <AlignedText>
          <Confidentiality size={24} />
          <Text> - Confidentiality </Text>
        </AlignedText>
        <AlignedText>
          <SignOut size={24} />
          <Text> - SignOut </Text>
        </AlignedText>
        <AlignedText>
          <Lock size={24} />
          <Text> - Lock </Text>
        </AlignedText>
        <AlignedText>
          <Profile size={24} />
          <Text> - Profile </Text>
        </AlignedText>
        <AlignedText>
          <LifeBuoy size={24} />
          <Text> - LifeBuoy </Text>
        </AlignedText>
        <AlignedText>
          <Bell size={24} />
          <Text> - Bell </Text>
        </AlignedText>
        <AlignedText>
          <ProfileDeletion size={24} />
          <Text> - ProfileDeletion </Text>
        </AlignedText>
        <AlignedText>
          <Booking size={24} />
          <Text> - Booking </Text>
        </AlignedText>
        <AlignedText>
          <Calendar size={24} />
          <Text> - Calendar </Text>
        </AlignedText>
        <AlignedText>
          <LocationBuilding size={24} />
          <Text> - LocationBuilding </Text>
        </AlignedText>
        <AlignedText>
          <TicketBooked width={24} height={24} />
          <Text> - TicketBooked </Text>
        </AlignedText>
        <AlignedText>
          <LocationPointerNotFilled size={24} />
          <Text> - LocationPointerNotFilled </Text>
        </AlignedText>
      </AccordionItem>

      <Divider />

      {/* Inputs */}
      <AccordionItem title="Inputs">
        <Typo.Title4 color={ColorsEnum.TERTIARY}>Text Input</Typo.Title4>
        <TextInput value={inputText} onChangeText={setInputText} placeholder={'Placeholder'} />
        <Spacer.Column numberOfSpaces={1} />
        <InputRule
          title={'12 Caractères'}
          icon={inputText.length >= 12 ? Check : Close}
          color={inputText.length >= 12 ? ColorsEnum.GREEN_VALID : ColorsEnum.ERROR}
          iconSize={16}
        />
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Title4 color={ColorsEnum.TERTIARY}>Text Input - Email</Typo.Title4>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={doNothingFn}
          placeholder={'Placeholder'}
          value=""
        />
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Title4 color={ColorsEnum.TERTIARY}>Text Input - Error</Typo.Title4>
        <TextInput value="" onChangeText={doNothingFn} placeholder={'Placeholder'} isError={true} />
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Title4 color={ColorsEnum.TERTIARY}>Password Input</Typo.Title4>
        <PasswordInput value="" onChangeText={doNothingFn} placeholder={'Placeholder'} />
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Title4 color={ColorsEnum.TERTIARY}>Partial Date Input</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <PartialDateInput
          identifier={DatePartType.DAY}
          isValid={_partialDate.length === 4}
          maxLength={4}
          onChangeValue={setPartialDate}
          placeholder="AAAA"
        />
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Title4 color={ColorsEnum.TERTIARY}>Date Input</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <DateInput />
      </AccordionItem>

      <Divider />

      {/* SnackBar */}
      <AccordionItem title="SnackBar">
        <TouchableOpacity onPress={popupSnackBarSuccess}>
          <Typo.Title4 color={ColorsEnum.GREEN_VALID}>
            Popup Sucess SnackBar for 5 seconds
          </Typo.Title4>
        </TouchableOpacity>
        <Spacer.Column numberOfSpaces={1} />
        <TouchableOpacity onPress={popupSnackBarInfos}>
          <Typo.Title4 color={ColorsEnum.ACCENT}>Popup Information SnackBar</Typo.Title4>
        </TouchableOpacity>
      </AccordionItem>

      <Divider />

      {/* Search components */}
      <AccordionItem title="Search components">
        <SearchInput LeftIcon={() => <MagnifyingGlass />} placeholder="with left icon" />
        <Spacer.Column numberOfSpaces={4} />
        <Center>
          <Slider values={[0, 75]} max={300} showValues formatValues={(n) => `${n} €`} />
          <Slider values={[50]} showValues formatValues={(n) => `${n} km`} />
          <Spacer.Column numberOfSpaces={4} />
          <ExampleSwitch />
          <Spacer.Column numberOfSpaces={4} />
        </Center>
        <RowWrap>
          <Label label="Cinéma" />
          <Label label="Musique" />
          <Label label="Exposition" />
        </RowWrap>
      </AccordionItem>

      <Divider />

      {/* Banner components */}
      <AccordionItem title="Banners">
        <AlignedText>
          <Banner title="Je suis une bannière" type={BannerType.INFO} />
        </AlignedText>
      </AccordionItem>

      <Divider />

      {/* Profile components */}
      <AccordionItem title="Profile components">
        <GreyView>
          <Spacer.Column numberOfSpaces={1} />
          <Text> Progress bars </Text>
          <Spacer.Column numberOfSpaces={3} />
          <View>
            <ProgressBar progress={0} color={ColorsEnum.GREEN_VALID} icon={Close} />
            <ProgressBar progress={0.3} color={ColorsEnum.PRIMARY_DARK} icon={Close} />
            <ProgressBar progress={1} color={ColorsEnum.SECONDARY} icon={Close} />
          </View>
          <Spacer.Column numberOfSpaces={1} />
          <View>
            <ProgressBar progress={0.5} color={ColorsEnum.PRIMARY} icon={Close} />
            <ProgressBar progress={1} color={ColorsEnum.TERTIARY} icon={Close} />
          </View>
        </GreyView>
        <Spacer.Column numberOfSpaces={4} />
        <View>
          <Text>Section Row </Text>
          <SectionRow
            type="navigable"
            title="navigable"
            icon={Close}
            onPress={() => Alert.alert('gooo !!!')}
          />
          <SectionRow type="clickable" title="with CTA" icon={Close} cta={<ExampleSwitch />} />
          <SectionRow
            type="clickable"
            title="just clickable"
            icon={Close}
            onPress={() => Alert.alert('clicked')}
          />
        </View>
        <Spacer.Column numberOfSpaces={4} />
        <View>
          <NonBeneficiaryHeader email="john@doe.com" dateOfBirth={`${year}-01-28T01:32:15`} />
        </View>
        <View>
          <AlignedText>
            <Text>Date de naissance: {year}-01-28</Text>
          </AlignedText>
          <AlignedText>
            <Button title="-1 an" onPress={() => setYear((year) => year + 1)} />
            <Spacer.Column numberOfSpaces={2} />
            <Text>{THIS_YEAR - year} ans</Text>
            <Spacer.Column numberOfSpaces={2} />
            <Button title="+1 an" onPress={() => setYear((year) => year - 1)} />
          </AlignedText>
        </View>

        <Spacer.Column numberOfSpaces={4} />
        <View>
          <BeneficiaryCeilings depositVersion={1} expenses={expenses_v1} walletBalance={400} />
          <Spacer.Column numberOfSpaces={4} />
          <BeneficiaryCeilings depositVersion={2} expenses={expenses_v2} walletBalance={150} />
        </View>
      </AccordionItem>

      <Divider />

      {/* Your components */}
      <AccordionItem title="Your components">
        <AlignedText>
          <Text>
            <ExternalLink url="https://google.com" />
            <Text> - ExternalLink </Text>
          </Text>
        </AlignedText>
        <AlignedText>
          <Rectangle />
          <Text> - Rectangle </Text>
        </AlignedText>

        <AlignedText>
          <OfferBackPlaceholder />
          <Text> - OfferBackPlaceholder </Text>
        </AlignedText>

        <AlignedText>
          <StepDots numberOfSteps={NUMBER_OF_STEPS} currentStep={currentStep} />
          <Text> - Steps </Text>
        </AlignedText>

        <AlignedText>
          <Button
            title="Back"
            onPress={() => setCurrentStep((step) => (step === 1 ? step : step - 1))}
          />
          <Spacer.Column numberOfSpaces={2} />
          <Button
            title="Next"
            onPress={() => setCurrentStep((step) => (step === NUMBER_OF_STEPS ? step : step + 1))}
          />
        </AlignedText>
      </AccordionItem>
      <Spacer.Column numberOfSpaces={5} />
      <Spacer.BottomScreen />
    </StyledScrollView>
  )
}

const AlignedText = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
})
const Center = styled(View)({
  alignItems: 'center',
})
const GreyView = styled.View({
  backgroundColor: ColorsEnum.GREY_LIGHT,
})

const RowWrap = styled.View({
  flexWrap: 'wrap',
  flexDirection: 'row',
})

const StyledScrollView = styled(ScrollView)({
  backgroundColor: ColorsEnum.WHITE,
})

function doNothingFn() {
  /* do nothing */
}

const Divider = styled.View({
  height: getSpacing(2),
  backgroundColor: ColorsEnum.GREY_LIGHT,
})

const CategoryIcons = () => {
  return (
    <React.Fragment>
      <Text>{'Categories'}</Text>
      {[...Object.values(CategoryNameEnum), null].map((category: string | null) => {
        const Icon = mapCategoryToIcon(category as CategoryNameEnum | null)
        const BicolorIcon =
          category && category in CATEGORY_CRITERIA
            ? CATEGORY_CRITERIA[category as CategoryNameEnum].icon
            : CATEGORY_CRITERIA['ALL'].icon

        return (
          <AlignedText key={category || "ŒUVRE D'ART"}>
            <Icon size={24} color={ColorsEnum.GREY_DARK} />
            <BicolorIcon size={24} color={ColorsEnum.PRIMARY} color2={ColorsEnum.PRIMARY} />
            <BicolorIcon size={24} color={ColorsEnum.PRIMARY} color2={ColorsEnum.SECONDARY} />
            <Text> - {category || "ŒUVRE D'ART / TOUTES"} </Text>
          </AlignedText>
        )
      })}
      <Text>{'\n'}</Text>
    </React.Fragment>
  )
}

const Label: React.FC<{ label: string }> = ({ label }) => {
  const [selected, setSelected] = useState<boolean>(false)
  return <SelectionLabel label={label} selected={selected} onPress={() => setSelected((p) => !p)} />
}
const ExampleSwitch: React.FC = () => {
  const [active, setActive] = useState<boolean>(false)
  return <FilterSwitch active={active} toggle={() => setActive((prevActive) => !prevActive)} />
}
