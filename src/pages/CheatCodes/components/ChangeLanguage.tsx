import React, { useState } from 'react';
import { Button, View } from 'react-native';
import { i18n } from '../../../lib/i18n';

interface Props {
  onLanguageChange?: () => void;
}

export const ChangeLanguage = (props: Props) => {
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = (value: string) => () => {
    i18n.activate(value);
    setLanguage(value);

    if (props.onLanguageChange) {
      props.onLanguageChange();
    }
  };

  return (
    <View>
      <Button
        title="FR"
        testID="frLanguageButton"
        onPress={changeLanguage('fr')}
        disabled={language === 'fr'}
      />
      <Button
        title="EN"
        testID="enLanguageButton"
        onPress={changeLanguage('en')}
        disabled={language === 'en'}
      />
    </View>
  );
};
