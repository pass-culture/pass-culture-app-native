import React from 'react'

import { fireEvent, render, screen } from 'tests/utils'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tellus in magna convallis egestas eget id justo. Donec lorem ante, tempor eu diam quis, laoreet rhoncus tortor. Sed posuere quis sapien sit amet rutrum. Nam arcu dui, blandit vitae massa ac, pulvinar rutrum tellus. Mauris molestie, sapien quis elementum interdum, ipsum turpis varius lorem, quis luctus tellus est et velit. Curabitur accumsan, enim ac tincidunt varius, lectus ligula elementum elit, a porta velit libero quis nunc. Maecenas semper augue justo, ac dapibus erat porttitor quis. Cras porttitor pharetra quam, et suscipit felis fringilla in. Aliquam ultricies mauris at vehicula finibus. Donec sed justo turpis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc dictum tempus velit, nec volutpat dolor fermentum non. Nullam efficitur diam nec orci aliquam, ut accumsan turpis convallis. Duis erat diam, ultricies non dolor a, elementum sagittis nibh. Curabitur dapibus ipsum eget quam scelerisque, eget venenatis urna laoreet.'

describe('<CollapsibleText />', () => {
  describe('When collapsible text is expanded', () => {
    it('should display all text', () => {
      render(<CollapsibleText text={text} isExpanded numberOfLines={5} />)

      expect(screen.getByText(text).props.numberOfLines).toBeUndefined()
    })

    it('should display Voir moins on button text', () => {
      render(<CollapsibleText text={text} isExpanded numberOfLines={5} />)

      expect(screen.getByText('Voir moins')).toBeOnTheScreen()
    })

    it('should use Réduire le texte in button accessibility label', () => {
      render(<CollapsibleText text={text} isExpanded numberOfLines={5} />)

      expect(screen.getByLabelText('Réduire le texte')).toBeOnTheScreen()
    })

    it('should display Voir plus on button text when pressing it', () => {
      render(<CollapsibleText text={text} isExpanded numberOfLines={5} />)

      fireEvent.press(screen.getByText('Voir moins'))

      expect(screen.getByText('Voir plus')).toBeOnTheScreen()
    })

    it('should not display all text when pressing button', () => {
      render(<CollapsibleText text={text} isExpanded numberOfLines={5} />)

      fireEvent.press(screen.getByText('Voir moins'))

      expect(screen.getByText(text).props.numberOfLines).toEqual(5)
    })

    it('should use Étendre le texte in button accessibility label when pressing button', () => {
      render(<CollapsibleText text={text} isExpanded numberOfLines={5} />)

      fireEvent.press(screen.getByText('Voir moins'))

      expect(screen.getByLabelText('Étendre le texte')).toBeOnTheScreen()
    })
  })

  describe('When collapsible text is not expanded', () => {
    it('should not display all text', () => {
      render(<CollapsibleText text={text} numberOfLines={5} />)

      expect(screen.getByText(text).props.numberOfLines).toEqual(5)
    })

    it('should display Voir plus on button text', () => {
      render(<CollapsibleText text={text} numberOfLines={5} />)

      expect(screen.getByText('Voir plus')).toBeOnTheScreen()
    })

    it('should use Étendre le texte in button accessibility label', () => {
      render(<CollapsibleText text={text} numberOfLines={5} />)

      expect(screen.getByLabelText('Étendre le texte')).toBeOnTheScreen()
    })

    it('should display Voir moins on button text when pressing it', () => {
      render(<CollapsibleText text={text} numberOfLines={5} />)

      fireEvent.press(screen.getByText('Voir plus'))

      expect(screen.getByText('Voir moins')).toBeOnTheScreen()
    })

    it('should display all text when pressing button', () => {
      render(<CollapsibleText text={text} numberOfLines={5} />)

      fireEvent.press(screen.getByText('Voir plus'))

      expect(screen.getByText(text).props.numberOfLines).toBeUndefined()
    })

    it('should use Réduire le texte in button accessibility label when pressing button', () => {
      render(<CollapsibleText text={text} numberOfLines={5} />)

      fireEvent.press(screen.getByText('Voir plus'))

      expect(screen.getByLabelText('Réduire le texte')).toBeOnTheScreen()
    })
  })
})
