DatesHoursModal
 should show
- the calendar when picking 'Date précise'
- the correct date when picking 'Date précise'
- by default time range defined in search state


 should desactivate
- toggle date when pressing reset button
- toggle hour when pressing reset button


 should reset
- time range selected when pressing reset button
- time range selected when deactivating hour toggle


 should activate by default
- date toggle when date defined in search state
- hour toggle when time range defined in search state


 should select by default


 with "Appliquer le filtre" button
- should display alternative button title
- should update search state when pressing submit button


 should set search state view on search results
- with actual state without change when pressing button
- with a time range filter when toggle hour activated and pressing button
- without beginning & ending date when pressing button


 with "Recherche" button


 Modal header buttons
- should close the modal and general filter page when pressing close button when the modal is opening from general filter page
- should only close the modal when pressing close button when the modal is opening from search results


 <DatesHoursModal/>
- should render modal correctly after animation and with enabled submit
- should hide and show the CalendarPicker
- should close the modal when pressing previous button

