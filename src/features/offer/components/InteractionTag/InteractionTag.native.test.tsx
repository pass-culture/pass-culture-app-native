import React from 'react'

import { InteractionTag } from 'features/offer/components/InteractionTag/InteractionTag'
import { render, screen } from 'tests/utils'

describe('<InteractionTag />', () => {
  it('should not return interaction tag when no counter defined', () => {
    render(<InteractionTag />)

    expect(screen.toJSON()).toBeNull()
  })

  it('should not return interaction tag when all counter defined at 0', () => {
    render(<InteractionTag chroniclesCount={0} headlineCount={0} likesCount={0} />)

    expect(screen.toJSON()).toBeNull()
  })

  it('should return headline tag when headline counter defined and likes counter < 20', () => {
    render(<InteractionTag headlineCount={10} likesCount={19} />)

    expect(screen.getByText('Reco par les lieux')).toBeOnTheScreen()
  })

  it('should return likes tag when headline counter defined and likes counter = 20', () => {
    render(<InteractionTag headlineCount={10} likesCount={20} />)

    expect(screen.getByText('20 j’aime')).toBeOnTheScreen()
  })

  it('should return likes tag when headline counter defined and likes counter > 20', () => {
    render(<InteractionTag headlineCount={10} likesCount={21} />)

    expect(screen.getByText('21 j’aime')).toBeOnTheScreen()
  })

  it('should return book club tag when headline counter, chronicles counter defined and likes counter < 50', () => {
    render(<InteractionTag headlineCount={10} chroniclesCount={10} likesCount={49} />)

    expect(screen.getByText('Reco du Book Club')).toBeOnTheScreen()
  })

  it('should return likes tag when headline counter, chronicles counter defined and likes counter = 50', () => {
    render(<InteractionTag headlineCount={10} chroniclesCount={10} likesCount={50} />)

    expect(screen.getByText('50 j’aime')).toBeOnTheScreen()
  })

  it('should return likes tag when headline counter, chronicles counter defined and likes counter > 50', () => {
    render(<InteractionTag headlineCount={10} chroniclesCount={10} likesCount={51} />)

    expect(screen.getByText('51 j’aime')).toBeOnTheScreen()
  })

  it('should return likes tag when likes counter defined and counter > 0', () => {
    render(<InteractionTag likesCount={18} />)

    expect(screen.getByText('18 j’aime')).toBeOnTheScreen()
  })

  it('should return book club tag when book club counter defined and counter > 0', () => {
    render(<InteractionTag chroniclesCount={5} />)

    expect(screen.getByText('Reco du Book Club')).toBeOnTheScreen()
  })

  it('should return book club tag when book club and headline counters defined and counters > 0', () => {
    render(<InteractionTag chroniclesCount={5} headlineCount={5} />)

    expect(screen.getByText('Reco du Book Club')).toBeOnTheScreen()
  })

  it('should return headline tag when headline counter defined and counter > 0', () => {
    render(<InteractionTag headlineCount={5} />)

    expect(screen.getByText('Reco par les lieux')).toBeOnTheScreen()
  })
})
