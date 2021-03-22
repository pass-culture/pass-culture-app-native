import { t } from '@lingui/macro'
import React, { useEffect, useRef } from 'react'
import { Animated, Platform } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import { useFavorites } from 'features/favorites/pages/useFavorites'
import { _ } from 'libs/i18n'
import { BicolorFavorite } from 'ui/svg/icons/BicolorFavorite'
import { BicolorFavoriteAuthed } from 'ui/svg/icons/BicolorFavoriteAuthed'
import { Pastille } from 'ui/svg/icons/Pastille'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, Typo } from 'ui/theme'

const COUNT_MAX = 100

const defaultPaddingRight = Platform.OS === 'android' ? 1 : 0

export const BicolorFavoriteCount: React.FC<BicolorIconInterface> = ({
  size = 32,
  color,
  color2,
  thin = false,
  testID,
}) => {
  const { isLoggedIn } = useAuthContext()
  const { data } = useFavorites()
  const scaleAnimation = useRef(new Animated.Value(1))
  useEffect(() => {
    if (data?.nbFavorites) {
      Animated.sequence([
        Animated.timing(scaleAnimation.current, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnimation.current, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start()
    }
  }, [data?.nbFavorites])

  if (!isLoggedIn || !data) {
    return <BicolorFavorite size={size} color={color} color2={color2} thin={thin} testID={testID} />
  }
  const hasTooMany = data.nbFavorites >= COUNT_MAX
  return (
    <Container testID="bicolor-favorite-count">
      <BicolorFavoriteAuthed
        size={size}
        color={color}
        color2={color2}
        thin={thin}
        testID={testID}
      />
      <CountPositionContainer>
        <Animated.View style={{ transform: [{ scale: scaleAnimation.current }] }}>
          <CountContainer>
            <Pastille color={thin ? ColorsEnum.GREY_DARK : undefined} />
            {hasTooMany ? (
              <React.Fragment>
                <Count paddingRight={5}>{COUNT_MAX - 1}</Count>
                <Plus>{_(t`+`)}</Plus>
              </React.Fragment>
            ) : (
              <Count paddingRight={defaultPaddingRight}>{data.nbFavorites || '0'}</Count>
            )}
          </CountContainer>
        </Animated.View>
      </CountPositionContainer>
    </Container>
  )
}

const Container = styled.View({
  position: 'relative',
})

const CountPositionContainer = styled.View({
  position: 'absolute',
  right: -5,
  top: 10,
})

const CountContainer = styled.View({
  position: 'relative',
  alignItems: 'center',
})

const Plus = styled(Typo.Caption).attrs({
  color: ColorsEnum.WHITE,
})({
  position: 'absolute',
  fontSize: 8,
  height: 15,
  right: 2,
  bottom: 1,
})

const Count = styled(Typo.Caption).attrs({
  color: ColorsEnum.WHITE,
})<{ paddingRight?: number | undefined }>(({ paddingRight }) => ({
  position: 'absolute',
  fontSize: 9,
  textAlign: 'center',
  height: 15,
  paddingRight,
  bottom: 1,
}))
