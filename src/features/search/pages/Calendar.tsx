import React from 'react'
import { Text, View } from 'react-native'
import { CalendarList, LocaleConfig } from 'react-native-calendars'

import { Spacer } from 'ui/theme'

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ],
  monthNamesShort: [
    'Janv.',
    'Févr.',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juil.',
    'Août',
    'Sept.',
    'Oct.',
    'Nov.',
    'Déc.',
  ],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
}
LocaleConfig.defaultLocale = 'fr'
export const Calendar: React.FC = () => (
  <React.Fragment>
    <Spacer.TopScreen />
    <CalendarList
      minDate={'2021-02-02'}
      maxDate={'2021-12-30'}
      onDayPress={(day) => {
        console.log('selected day', day)
      }}
      monthFormat={'MMMM yyyy'}
      hideDayNames={true}
      firstDay={1}
      disableAllTouchEventsForDisabledDays={true}
      // renderHeader={(date) => <Text>Mois</Text>}
      pastScrollRange={0}
      futureScrollRange={50}
      scrollEnabled={true}
      showScrollIndicator={true}
      markedDates={{
        '2021-02-20': { disabled: true },
      }}
      renderHeader={(date) => <Text>{`${date.getMonth()} ${date.getFullYear()}`}</Text>}
      dayComponent={({ date, state, marking }) => {
        console.log(marking)
        return (
          // <View>
          //   <Text
          //     style={{
          //       textAlign: 'center',
          //       textDecorationLine: 'line-through',
          //       color: state === 'disabled' || marking['disabled'] === true ? 'gray' : 'black',
          //     }}>
          //     {date.day}
          //   </Text>
          //   <Text
          //     style={{
          //       textAlign: 'center',
          //       color: state === 'disabled' || marking['disabled'] === true ? 'gray' : 'black',
          //       fontSize: 10,
          //     }}>
          //     2€
          //   </Text>
          // </View>
          <React.Fragment>
            {state === 'disabled' || marking['disabled'] === true ? (
              <View
                style={{
                  position: 'absolute',
                  transform: [{ rotate: '135deg' }],
                  top: 8,
                  width: 28,
                  height: 1,
                  borderBottomColor: 'gray',
                  borderBottomWidth: 1,
                }}
              />
            ) : null}
            <Text>{date.day}</Text>
            <Text>19.90€</Text>
          </React.Fragment>
        )
      }}
    />
  </React.Fragment>
)
