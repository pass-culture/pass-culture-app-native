import { showBusinessModule } from 'features/home/components/modules/business/helpers/showBusinessModule'

describe('showBusinessModule()', () => {
  it.each`
    targetNotConnectedUsersOnly | connected | showModule
    ${undefined}                | ${true}   | ${true}
    ${undefined}                | ${false}  | ${true}
    ${false}                    | ${true}   | ${true}
    ${false}                    | ${false}  | ${false}
    ${true}                     | ${true}   | ${false}
    ${true}                     | ${false}  | ${true}
  `(
    'showBusinessModule($targetNotConnectedUsersOnly, $connected) \t= $showModule',
    ({ targetNotConnectedUsersOnly, connected, showModule: expected }) => {
      const show = showBusinessModule(targetNotConnectedUsersOnly, connected)
      expect(show).toBe(expected)
    }
  )
})
