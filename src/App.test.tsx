import React from 'react';
import TestRenderer from 'react-test-renderer';
import { App } from './App';
import { tick } from 'libs/utils.test';

describe('App', () => {
  it('instantiate the application', async () => {
    TestRenderer.create(<App />);
    await TestRenderer.act(async () => {
      await tick();
    });
  });
});
