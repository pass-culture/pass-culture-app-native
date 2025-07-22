import { SignupFormService } from 'poc/signup-form.service'
import React, { FC } from 'react'
import { Button, Text, TextInput, View } from 'react-native'
import { useSnapshot } from 'valtio'

const service = new SignupFormService()

export const SignupForm: FC = () => {
  const snap = useSnapshot(service.state)

  return (
    <View>
      <Text>SignupForm</Text>
      <TextInput
        placeholder="Email"
        value={snap.email.value}
        onChangeText={(email) => service.changeEmail(email)}
      />
      <TextInput
        placeholder="Prénom"
        value={snap.firstName.value}
        onChangeText={(firstName) => service.changeFirstName(firstName)}
      />
      <TextInput
        placeholder="Nom de famille"
        value={snap.lastName.value}
        onChangeText={(lastName) => service.changeLastName(lastName)}
      />
      <TextInput onChangeText={() => null} />
      <Button title="submit" onPress={() => null} />
    </View>
  )
}
