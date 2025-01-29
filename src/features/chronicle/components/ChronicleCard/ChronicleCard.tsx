import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ChronicleCardData } from 'features/chronicle/type'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { Separator } from 'ui/components/Separator'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { PlainMore } from 'ui/svg/icons/PlainMore'
import { TypoDS, getShadow, getSpacing } from 'ui/theme'

const CHRONICLE_THUMBNAIL_SIZE = getSpacing(14)

type Props = ChronicleCardData & {
  cardWidth?: number
  shouldShowSeeMoreButton?: boolean
  navigateTo?: InternalNavigationProps['navigateTo']
}

export const ChronicleCard: FunctionComponent<Props> = ({
  id,
  title,
  subtitle,
  description,
  date,
  cardWidth,
  shouldShowSeeMoreButton,
  navigateTo,
}) => {
  return (
    <Container gap={3} testID={`chronicle-card-${id.toString()}`} width={cardWidth}>
      <InfoHeader
        title={title}
        subtitle={subtitle}
        defaultThumbnailSize={CHRONICLE_THUMBNAIL_SIZE}
        thumbnailComponent={<BookClubCertification />}
      />
      <Separator.Horizontal />
      <Description>{description}</Description>
      <BottomCardContainer>
        <PublicationDate>{date}</PublicationDate>
        {shouldShowSeeMoreButton && navigateTo ? (
          <View>
            <InternalTouchableLink
              as={StyledButtonTertiaryBlack}
              wording="Voir plus"
              navigateTo={navigateTo}
            />
          </View>
        ) : null}
      </BottomCardContainer>
    </Container>
  )
}

const Container = styled(ViewGap)<{ width?: number }>(({ theme, width }) => ({
  padding: getSpacing(6),
  borderRadius: getSpacing(2),
  border: 1,
  borderColor: theme.colors.greyMedium,
  ...(width === undefined ? undefined : { width }),

  backgroundColor: theme.colors.white,
  ...getShadow({
    shadowOffset: { width: 0, height: getSpacing(1) },
    shadowRadius: getSpacing(6),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.15,
  }),
}))

const Description = styled(TypoDS.BodyAccentS)(({ theme }) => ({
  color: theme.colors.greyDark,
  flexGrow: 1,
}))

const BottomCardContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const PublicationDate = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
  alignSelf: 'center',
}))

const StyledPlainMore = styled(PlainMore).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const StyledButtonTertiaryBlack = styledButton(ButtonTertiaryBlack).attrs({
  icon: StyledPlainMore,
  iconPosition: 'right',
  buttonHeight: 'extraSmall',
})``
