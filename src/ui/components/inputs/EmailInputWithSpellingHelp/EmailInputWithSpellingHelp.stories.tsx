import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { EmailInputWithSpellingHelp } from './EmailInputWithSpellingHelp'

export default {
  title: 'ui/forms/emailInputWithSpellingHelp',
  component: EmailInputWithSpellingHelp,
} as ComponentMeta<typeof EmailInputWithSpellingHelp>

const Template: ComponentStory<typeof EmailInputWithSpellingHelp> = (props) => (
  <EmailInputWithSpellingHelp {...props} />
)

export const Default = Template.bind({})
Default.args = {
  label: 'Adresse e-mail',
  email: 'email@gmail.com',
}

export const WithSpellingHelp: ComponentStory<typeof EmailInputWithSpellingHelp> = (props) => {
  const { control } = useForm<{ email: string }>({
    defaultValues: {
      email: props.email,
    },
  })

  return (
    <Controller
      control={control}
      name="email"
      render={({ field: { onChange, onBlur, value } }) => (
        <EmailInputWithSpellingHelp
          label="Adresse e-mail"
          email={value}
          onEmailChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  )
}
WithSpellingHelp.args = {
  label: 'Adresse e-mail',
  email: 'email@gmal.com',
}
