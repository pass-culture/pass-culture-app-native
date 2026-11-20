import { expect, test } from '../../fixtures'

test.describe('booking', { tag: '@smoke' }, () => {
  test('a beneficiary user can book and cancel a book offer', async ({
    authenticatedPage: _authenticatedPage,
    navigationBar,
    searchPage,
    offerPage,
    bookingPage,
  }) => {
    await navigationBar.goToSearch()
    await searchPage.openCategory('Livres')
    await searchPage.openSubcategory('Romans & littérature')
    await searchPage.openFirstOffer()
    await offerPage.reserve()

    await expect(bookingPage.detailsHeading).toBeVisible()
    await bookingPage.confirm()

    await expect(bookingPage.successHeading).toBeVisible()
    await bookingPage.goToBooking()
    await bookingPage.cancel()

    await expect(bookingPage.cancelSuccessMessage).toBeVisible()
  })
})
