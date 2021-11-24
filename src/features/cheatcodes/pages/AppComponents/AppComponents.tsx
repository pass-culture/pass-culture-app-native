/* eslint-disable react-native/no-raw-text */
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useState } from 'react'
import { ScrollView, View, Text, Alert, Button } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import QRCode from 'react-native-qrcode-svg'
import styled from 'styled-components/native'

import { CallToActionIcon, CategoryIdEnum, PopOverIcon, VenueTypeCodeKey } from 'api/gen/api'
import { SIGNUP_NUMBER_OF_STEPS } from 'features/auth/api'
import { EndedBookingTicket } from 'features/bookings/components/EndedBookingTicket'
import { OnGoingTicket } from 'features/bookings/components/OnGoingTicket'
import { ThreeShapesTicket } from 'features/bookings/components/ThreeShapesTicket'
import { Icons } from 'features/cheatcodes/pages/AppComponents/Icons'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { BeneficiaryCeilings } from 'features/profile/components/BeneficiaryCeilings'
import { IdCheckProcessingBadge } from 'features/profile/components/IdCheckProcessingBadge'
import { NonBeneficiaryHeader } from 'features/profile/components/NonBeneficiaryHeader'
import { SelectionLabel } from 'features/search/atoms/SelectionLabel'
import { MAP_CATEGORY_ID_TO_ICON } from 'libs/parsers'
import { useUtmParams } from 'libs/utm'
import { AccordionItem } from 'ui/components/AccordionItem'
import { Badge } from 'ui/components/Badge'
import { Banner, BannerType } from 'ui/components/Banner'
import { ProgressBar } from 'ui/components/bars/ProgressBar'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonQuaternary } from 'ui/components/buttons/ButtonQuaternary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'
import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'
import { ClippedTag } from 'ui/components/ClippedTag'
import FilterSwitch from 'ui/components/FilterSwitch'
import { Hero } from 'ui/components/hero/Hero'
import { ImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { DateInput } from 'ui/components/inputs/DateInput'
import { LargeTextInput } from 'ui/components/inputs/LargeTextInput'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { InputRule } from 'ui/components/inputs/rules/InputRule'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Slider } from 'ui/components/inputs/Slider'
import { TextInput } from 'ui/components/inputs/TextInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { RadioButton } from 'ui/components/RadioButton'
import { SectionRow } from 'ui/components/SectionRow'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { StepDots } from 'ui/components/StepDots'
import { BackgroundPlaceholder } from 'ui/svg/BackgroundPlaceholder'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Category } from 'ui/svg/icons/categories'
import { Check } from 'ui/svg/icons/Check'
import { Close } from 'ui/svg/icons/Close'
import { MagnifyingGlassDeprecated } from 'ui/svg/icons/MagnifyingGlass_deprecated'
import { Rectangle } from 'ui/svg/Rectangle'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

function onButtonPress() {
  Alert.alert('you pressed it')
}

const THIS_YEAR = new Date().getFullYear()

const domains_credit_v1 = {
  all: { initial: 50000, remaining: 40000 },
  physical: { initial: 30000, remaining: 10000 },
  digital: { initial: 30000, remaining: 20000 },
}

const domains_credit_v2 = {
  all: { initial: 30000, remaining: 10000 },
  digital: { initial: 20000, remaining: 5000 },
}

const domains_credit_underage = {
  all: { initial: 3000, remaining: 1000 },
}

export const AppComponents: FunctionComponent = () => {
  const {
    visible: basicModalVisible,
    showModal: showBasicModal,
    hideModal: hideBasicModal,
  } = useModal(false)
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack('CheatMenu', undefined)

  const [buttonIsLoading, setButtonIsLoading] = useState(false)
  const [inputText, setInputText] = useState('')
  const [largeInputText, setLargeInputText] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [year, setYear] = useState(THIS_YEAR - 18)
  const [radioButtonChoice, setRadioButtonChoice] = useState('')
  const { campaign, source, medium, campaignDate } = useUtmParams()
  const [popOverIconString, setPopOverIconString] = useState<string>()
  const [callToActionIconString, setCallToActionIconString] = useState<string>()
  const [callToActionTitle, setCallToActionTitle] = useState<string>()
  const [callToActionLink, setCallToActionLink] = useState<string>()

  function navigateToIdCheckUnavailable() {
    navigate('IdCheckUnavailable')
  }

  const onTriggerFakeLoading = useCallback(() => {
    setButtonIsLoading(true)
    setTimeout(() => setButtonIsLoading(false), 3000)
  }, [])

  return (
    <StyledScrollView>
      <Spacer.TopScreen />
      <ModalHeader
        title="App components"
        leftIconAccessibilityLabel={'Revenir en arrière'}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIconAccessibilityLabel={undefined}
        rightIcon={undefined}
        onRightIconPress={undefined}
      />

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
        <ButtonQuaternaryBlack title="Se connecter" onPress={onButtonPress} icon={Close} />
        {/* Buttons: With linear gradient */}
        <Typo.Title4>Button - With linear gradient</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <ButtonWithLinearGradient
          wording="CallToAction"
          onPress={onButtonPress}
          isDisabled={false}
        />
        <Spacer.Column numberOfSpaces={1} />
        <ButtonWithLinearGradient
          wording="CallToAction external"
          onPress={onButtonPress}
          isDisabled={false}
          isExternal
        />
        <Spacer.Column numberOfSpaces={1} />
        <ButtonWithLinearGradient
          wording="Disabled CallToAction"
          onPress={onButtonPress}
          isDisabled={true}
        />
      </AccordionItem>

      <Divider />

      {/* Heros */}
      <AccordionItem title="Heros">
        <Typo.Title4>Default Hero - Offer</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <Hero imageUrl={undefined} type="offer" categoryId={CategoryIdEnum.CINEMA} />
        <Typo.Title4>Default Hero - Venue</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <Hero imageUrl={undefined} type="venue" venueType={VenueTypeCodeKey.ARTISTICCOURSE} />
        <Spacer.Column numberOfSpaces={4} />
        <Typo.Title4>Landscape Hero - Venue with image</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <Hero
          imageUrl="https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg"
          type="venue"
          venueType={VenueTypeCodeKey.ARTISTICCOURSE}
        />
      </AccordionItem>

      <Divider />

      {/* Tags */}
      <AccordionItem title="Tags">
        <ClippedTag label="Musée du Louvre" onPress={onButtonPress} testId="Enlever le lieu" />
      </AccordionItem>

      <Divider />

      {/* ImagePlaceholder */}
      <AccordionItem title="ImagePlaceholder">
        <ImagePlaceholder
          Icon={MAP_CATEGORY_ID_TO_ICON.FILM}
          size={getSpacing(24)}
          borderRadius={4}
        />
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
          leftIconAccessibilityLabel="leftIconButton"
          leftIcon={ArrowPrevious}
          onLeftIconPress={hideBasicModal}
          rightIconAccessibilityLabel="rightIconButton"
          rightIcon={Close}
          onRightIconPress={hideBasicModal}>
          <Text>A simple content</Text>
        </AppModal>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Title4>Modal - Progressive</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Title4>Modal Header</Typo.Title4>
        <ModalHeader
          title="My modal header"
          leftIconAccessibilityLabel="Revenir en arrière"
          leftIcon={ArrowPrevious}
          onLeftIconPress={() => null}
          rightIconAccessibilityLabel="Revenir à l'accueil"
          rightIcon={Close}
          onRightIconPress={() => null}
        />
      </AccordionItem>

      <Divider />

      {/* Sections */}
      <AccordionItem title="Sections">
        <SectionWithDivider visible margin>
          <View>
            <Typo.Title4>Section with divider</Typo.Title4>
            <Typo.Body>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate quas aut laborum,
              dolor sapiente quos doloribus sequi reprehenderit ullam porro rem corrupti libero
              repellendus nam vel suscipit consequuntur blanditiis omnis.
            </Typo.Body>
          </View>
        </SectionWithDivider>
      </AccordionItem>

      <Divider />

      {/* Switches */}
      <AccordionItem title="Switches">
        <FilterSwitchesSection />
      </AccordionItem>

      <Divider />

      {/* Icons */}
      <AccordionItem title="Icons">
        <Icons />
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
        <Typo.Title4 color={ColorsEnum.TERTIARY}>Short Input</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Title4 color={ColorsEnum.TERTIARY}>Date Input</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <Spacer.Flex flex={1}>
          <DateInput />
        </Spacer.Flex>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Title4 color={ColorsEnum.TERTIARY}>Code Input of length 20</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Caption color={ColorsEnum.BLACK}>is valid if number of 5 digits</Typo.Caption>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.Caption color={ColorsEnum.BLACK}>{inputText}</Typo.Caption>
        <Spacer.Column numberOfSpaces={1} />

        <Typo.Title4 color={ColorsEnum.TERTIARY}>Large input</Typo.Title4>
        <Spacer.Column numberOfSpaces={1} />
        <LargeTextInput value={largeInputText} onChangeText={setLargeInputText} maxLength={200} />
      </AccordionItem>

      <Divider />

      {/* SnackBar */}
      <AccordionItem title="SnackBar">
        <SnackBars />
      </AccordionItem>

      <Divider />

      {/* Search components */}
      <AccordionItem title="Search components">
        <SearchInput LeftIcon={() => <MagnifyingGlassDeprecated />} placeholder="with left icon" />
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

      <AccordionItem title="Radio button">
        <RadioButton
          id="1"
          title="item 1"
          description="description 1"
          onSelect={setRadioButtonChoice}
          selectedValue={radioButtonChoice}
        />
        <Typo.Caption>{`Selected : ${radioButtonChoice}`}</Typo.Caption>
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
          <NonBeneficiaryHeader
            eligibilityStartDatetime={`${year + 18}-01-28T00:00Z`}
            eligibilityEndDatetime={`${year + 19}-01-28T00:00Z`}
          />
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
        <Typo.Title4 color={ColorsEnum.TERTIARY}>Communication InApp</Typo.Title4>
        <Text>Long texte</Text>
        <View>
          <IdCheckProcessingBadge
            subscriptionMessage={{
              callToAction: {
                callToActionIcon: callToActionIconString as CallToActionIcon,
                callToActionTitle,
                callToActionLink,
              },
              popOverIcon: popOverIconString as PopOverIcon,
              userMessage: `Ceci est un très long message pour montrer que le texte est adaptatif est que ça ne posera aucun problème. Je suis sûr qu'on peut le rendre encore un peu plus long sans difficulté si on se creuse un peu les méninges`,
              updatedAt: new Date(`2021-10-25T13:24Z`),
            }}
          />
        </View>
        <Text>Affichage icône PopOverIcon</Text>
        <AlignedText>
          <Button title="Clock" onPress={() => setPopOverIconString('CLOCK')} />
          <Button title="Search" onPress={() => setPopOverIconString('MAGNIFYING_GLASS')} />
          <Button title="Warning" onPress={() => setPopOverIconString('WARNING')} />
          <Button title="Error" onPress={() => setPopOverIconString('ERROR')} />
        </AlignedText>
        <AlignedText>
          <Button title="File" onPress={() => setPopOverIconString('FILE')} />
          <Button title="No key" onPress={() => setPopOverIconString(undefined)} />
          <Button title="Unknown key" onPress={() => setPopOverIconString('Blablou')} />
        </AlignedText>
        <Text>Toggle CTA message and link</Text>
        <AlignedText>
          <Button
            title="CTA Message"
            onPress={() => {
              return callToActionTitle
                ? setCallToActionTitle(undefined)
                : setCallToActionTitle('Tu peux cliquer ici')
            }}
          />
        </AlignedText>
        <Text>CTA link</Text>
        <AlignedText>
          <Button title="None" onPress={() => setCallToActionLink(undefined)} />
          <Button title="External" onPress={() => setCallToActionLink('https://google.com')} />
          <Button title="Home" onPress={() => setCallToActionLink('passculture://home')} />
          <Button
            title="open mail"
            onPress={() => setCallToActionLink('passculture://openInbox')}
          />
        </AlignedText>
        <Text>Affichage icône CTA</Text>
        <AlignedText>
          <Button title="Email" onPress={() => setCallToActionIconString('EMAIL')} />
          <Button title="Retry" onPress={() => setCallToActionIconString('RETRY')} />
          <Button title="No key" onPress={() => setCallToActionIconString(undefined)} />
          <Button title="Unknown key" onPress={() => setCallToActionIconString('Blablou')} />
        </AlignedText>

        <Spacer.Column numberOfSpaces={4} />
        <View>
          <BeneficiaryCeilings
            domainsCredit={domains_credit_v1}
            isUserUnderageBeneficiary={false}
          />
          <Spacer.Column numberOfSpaces={4} />
          <BeneficiaryCeilings
            domainsCredit={domains_credit_v2}
            isUserUnderageBeneficiary={false}
          />
          <Spacer.Column numberOfSpaces={4} />
          <BeneficiaryCeilings
            domainsCredit={domains_credit_underage}
            isUserUnderageBeneficiary={true}
          />
        </View>
      </AccordionItem>

      <Divider />

      {/* UTM parameters */}
      <AccordionItem title="UTM parameters">
        <AlignedText>
          <Text>traffic_campaign: {campaign}</Text>
        </AlignedText>
        <AlignedText>
          <Text>traffic_medium: {medium}</Text>
        </AlignedText>
        <AlignedText>
          <Text>traffic_source: {source}</Text>
        </AlignedText>
        <AlignedText>
          <Text>campaign_date: {campaignDate?.toLocaleString()}</Text>
        </AlignedText>
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
          <BackgroundPlaceholder />
          <Text> - BackgroundPlaceholder </Text>
        </AlignedText>

        <AlignedText>
          <StepDots numberOfSteps={SIGNUP_NUMBER_OF_STEPS} currentStep={currentStep} />
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
            onPress={() =>
              setCurrentStep((step) => (step === SIGNUP_NUMBER_OF_STEPS ? step : step + 1))
            }
          />
        </AlignedText>
        <AlignedText>
          <OnGoingTicket
            altIcon={Category.Artwork}
            image="https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg"
          />
          <Text> - OnGoing Ticket </Text>
        </AlignedText>
        <AlignedText>
          <OnGoingTicket altIcon={Category.Artwork} />
          <Text> - OnGoing Ticket without image </Text>
        </AlignedText>
        <AlignedText>
          <EndedBookingTicket image="https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg" />
          <Text> - Ended booking Ticket </Text>
        </AlignedText>
        <AlignedText>
          <EndedBookingTicket categoryId={CategoryIdEnum.CINEMA} />
          <Text> - Ended booking Ticket without image </Text>
        </AlignedText>
        <AlignedText>
          <Badge label={1} />
          <Text> - Badge </Text>
        </AlignedText>
        <AlignedText>
          <ThreeShapesTicket width={200}>
            <Center>
              <QRCode value="passculture" />
            </Center>
          </ThreeShapesTicket>
          <Text>- {`contient le mot "passculture"`}</Text>
        </AlignedText>
        <AlignedText>
          <Center>
            <ButtonPrimary title="Deny Access To IdCheck" onPress={navigateToIdCheckUnavailable} />
          </Center>
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

const FilterSwitchesSection = () => {
  const [switch1, setSwitch1] = useState(true)
  const [switch2, setSwitch2] = useState(false)

  return (
    <React.Fragment>
      <SectionRow
        type="clickable"
        title="Active and enabled"
        cta={
          <FilterSwitch
            active={switch1}
            accessibilityLabel="Active and enabled"
            disabled={false}
            toggle={() => setSwitch1((p) => !p)}
          />
        }
      />
      <Spacer.Column numberOfSpaces={1} />
      <SectionRow
        type="clickable"
        title="Active and disabled"
        cta={
          <FilterSwitch
            active={true}
            accessibilityLabel="Active and disabled"
            disabled={true}
            toggle={() => null}
          />
        }
      />
      <Spacer.Column numberOfSpaces={1} />
      <SectionRow
        type="clickable"
        title="Inactive and enabled"
        cta={
          <FilterSwitch
            active={switch2}
            accessibilityLabel="Inactive and enabled"
            disabled={false}
            toggle={() => setSwitch2((p) => !p)}
          />
        }
      />
      <Spacer.Column numberOfSpaces={1} />
      <SectionRow
        type="clickable"
        title="Inactive and disabled"
        cta={
          <FilterSwitch
            active={false}
            accessibilityLabel="Inactive and disabled"
            disabled={true}
            toggle={() => null}
          />
        }
      />
    </React.Fragment>
  )
}

const Label: React.FC<{ label: string }> = ({ label }) => {
  const [selected, setSelected] = useState<boolean>(false)
  return <SelectionLabel label={label} selected={selected} onPress={() => setSelected((p) => !p)} />
}
const ExampleSwitch: React.FC = () => {
  const [active, setActive] = useState<boolean>(false)
  return (
    <FilterSwitch
      active={active}
      accessibilityLabel="Example Switch"
      toggle={() => setActive((prevActive) => !prevActive)}
    />
  )
}

const SnackBars = () => {
  const {
    showInfoSnackBar,
    showSuccessSnackBar,
    showErrorSnackBar,
    hideSnackBar,
  } = useSnackBarContext()

  const snackbars = [
    {
      title: '✅ Success SnackBar',
      showSnackBar: showSuccessSnackBar,
      message: 'This was a success !!! '.repeat(5),
      timeout: 5000,
    },
    {
      title: '❌ Error SnackBar',
      showSnackBar: showErrorSnackBar,
      message: 'There was an error !',
      timeout: 5000,
      onClose: hideSnackBar,
    },
    {
      title: 'ℹ️ Info SnackBar',
      showSnackBar: showInfoSnackBar,
      message: 'Hello, for your information...',
      timeout: 10000,
    },
  ]

  return (
    <React.Fragment>
      {snackbars.map(({ title, showSnackBar, ...settings }) => (
        <React.Fragment key={title}>
          <TouchableOpacity onPress={() => showSnackBar(settings)}>
            <Typo.Title4>{title}</Typo.Title4>
          </TouchableOpacity>
          <Spacer.Column numberOfSpaces={1} />
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}
