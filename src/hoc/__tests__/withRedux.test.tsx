import React from 'react';
import TestRenderer from 'react-test-renderer';
import { withRedux } from '../withRedux'; // @redux
import { store } from '../../redux/store'; // @redux
import { useSelector } from 'react-redux'; // @redux
import { tick } from '../../__tests__/utils.test';

describe('withRedux', () => {
  it('installs a redux provider', async () => {
    function MyComponent() {
      const selectedState = useSelector((state) => state);
      expect(selectedState).toEqual(store.getState());
      return null;
    }
    const App = withRedux(MyComponent);
    TestRenderer.create(<App />);
    await tick();
    expect.assertions(1);
  });
});
