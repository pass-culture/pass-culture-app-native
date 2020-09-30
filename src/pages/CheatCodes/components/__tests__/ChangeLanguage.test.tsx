import { act, fireEvent } from 'react-native-testing-library';
import { ChangeLanguage } from '../ChangeLanguage';
import { i18n } from '../../../../lib/i18n';
import { wrapWithProvidersAndRender } from '../../../../../jest/wrapWithProvidersAndRender';

describe('ChangeLanguage component', () => {
  it('changes language to french when FR in selected', async () => {
    const { component: changeLanguage } = wrapWithProvidersAndRender({
      Component: ChangeLanguage,
    });
    const Button = changeLanguage.getByTestId('frLanguageButton');

    act(() => {
      fireEvent.press(Button);
    });

    expect(i18n.language).toBe('fr');
  });

  it('should call the onLanguageChange callback', async () => {
    const onLanguageChange = jest.fn();
    const { component: changeLanguage } = wrapWithProvidersAndRender({
      Component: ChangeLanguage,
      props: {
        onLanguageChange: onLanguageChange,
      },
    });

    const Button = changeLanguage.getByTestId('frLanguageButton');
    act(() => {
      fireEvent.press(Button);
    });

    expect(onLanguageChange).toHaveBeenCalled();
  });
});
