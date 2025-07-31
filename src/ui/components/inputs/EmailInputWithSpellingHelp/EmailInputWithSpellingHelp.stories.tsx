import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { EmailInputWithSpellingHelp } from './EmailInputWithSpellingHelp'

const meta: Meta<typeof EmailInputWithSpellingHelp> = {
  title: 'ui/inputs/EmailInputWithSpellingHelp',
  component: EmailInputWithSpellingHelp,
}
export default meta

type Story = StoryObj<typeof EmailInputWithSpellingHelp>

const StoryComponent = (props: React.ComponentProps<typeof EmailInputWithSpellingHelp>) => {
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

export const WithGoodEmail: Story = {
  render: (props) => <StoryComponent {...props} />,
  args: {
    label: 'Adresse e-mail',
    email: 'firstname.lastname@gmail.com',
  },
}

export const WithSpellingHelp: Story = {
  render: (props) => <StoryComponent {...props} />,
  args: {
    label: 'Adresse e-mail',
    email: 'firstname.lastname@gmal.com',
  },
}
