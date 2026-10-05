import React from 'react'

import { goBack } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { SubcategoryIdEnum, TicketDisplayEnum } from 'api/gen'
import { Ticket } from 'features/bookings/components/Ticket/Ticket'
import { BookingProperties } from 'features/bookings/types'
import { beneficiaryUser } from 'fixtures/user'
import { subcategoriesMappingSnap } from 'libs/subcategories/fixtures/mappings'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('react-native-map-link')

const archiveBookingSpy = jest
  .spyOn(api, 'postNativeV1BookingsbookingIdToggleDisplay')
  .mockResolvedValue({})

const user = userEvent.setup()
jest.useFakeTimers()

const properties: BookingProperties = {
  isDuo: false,
  isEvent: false,
  isPhysical: false,
  isDigital: true,
  isPermanent: false,
  hasActivationCode: true,
}

describe('<Ticket />', () => {
  it('should archive booking when pressing the partner button', async () => {
    renderTicket({ subcategoryId: SubcategoryIdEnum.LIVRE_NUMERIQUE })

    await user.press(screen.getByText('Accéder au livre'))

    expect(archiveBookingSpy).toHaveBeenCalledWith({ ended: true }, 123)

    expect(goBack).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('snackbar-success')).toBeOnTheScreen()
  })

  it('should not archive booking when subcategory is CINE_VENTE_DISTANCE', async () => {
    renderTicket({ subcategoryId: SubcategoryIdEnum.CINE_VENTE_DISTANCE })

    await user.press(screen.getByText('Accéder à l’offre en ligne'))

    expect(archiveBookingSpy).not.toHaveBeenCalled()
    expect(goBack).not.toHaveBeenCalled()
    expect(screen.queryByTestId('snackbar-success')).not.toBeOnTheScreen()
  })
})

const renderTicket = ({ subcategoryId }: { subcategoryId: SubcategoryIdEnum }) => {
  const booking = mockBuilder.bookingResponseV2({
    completedUrl: 'https://example.com',
    ticket: {
      display: TicketDisplayEnum.online_code,
      token: { data: 'TEST12' },
      activationCode: null,
      voucher: null,
      withdrawal: {},
    },
    stock: {
      offer: {
        isDigital: true,
        subcategoryId,
      },
    },
  })

  return render(
    reactQueryProviderHOC(
      <Ticket
        properties={properties}
        booking={booking}
        mapping={subcategoriesMappingSnap as SubcategoriesMapping}
        user={beneficiaryUser}
        display="full"
        setTopBlockHeight={jest.fn()}
        ticket={booking.ticket}
      />
    )
  )
}
