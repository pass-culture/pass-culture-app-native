import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { EmailInputWithSpellingHelp } from './EmailInputWithSpellingHelp'

export default {
  title: 'ui/inputs/EmailInputWithSpellingHelp',
  component: EmailInputWithSpellingHelp,
} as ComponentMeta<typeof EmailInputWithSpellingHelp>

const Template: ComponentStory<typeof EmailInputWithSpellingHelp> = (props) => {
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
          {...props}
          email={value}
          onEmailChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  )
}

export const WithGoodEmail = Template.bind({})
WithGoodEmail.args = {
  label: 'Adresse e-mail',
  email: 'firstname.lastname@gmail.com',
}

export const WithSpellingHelp = Template.bind({})
WithSpellingHelp.args = {
  label: 'Adresse e-mail',
  email: 'firstname.lastname@gmal.com',
}
