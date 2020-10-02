import React from 'react';
import TestRenderer from 'react-test-renderer';
import CodePush from 'react-native-code-push'; // @codepush
import { CodePushButton } from './CodePushButton';
import { tick } from 'libs/utils.test';

describe('CodePushButton', () => {
  it('renders correctly', () => {
    const testRenderer = TestRenderer.create(<CodePushButton />);
    expect(testRenderer).toMatchSnapshot();
  });
  it('gets the metadata on mount', async () => {
    // We fake CodePush update metdata
    CodePush.getUpdateMetadata = jest.fn(() =>
      Promise.resolve({ label: 'V4', description: 'New Release !' })
    );
    const testRenderer = TestRenderer.create(<CodePushButton />);
    expect(CodePush.getUpdateMetadata).toHaveBeenCalled();
    await tick();
    // We expect that our state has those metadata
    expect(testRenderer.root.instance.state.info).toEqual('V4 (New Release !)');
    expect.assertions(2);
  });
  it('gets the partial metadata', async () => {
    // We fake CodePush update metdata with partial information
    CodePush.getUpdateMetadata = jest.fn(() => Promise.resolve({ label: 'V5' }));
    const testRenderer = TestRenderer.create(<CodePushButton />);
    expect(CodePush.getUpdateMetadata).toHaveBeenCalled();
    await tick();
    // We expect that our state has those metadata
    expect(testRenderer.root.instance.state.info).toEqual('V5');
    expect.assertions(2);
  });
  it('gets the partial metadata', async () => {
    // We fake CodePush update metdata with null information
    CodePush.getUpdateMetadata = jest.fn(() => Promise.resolve());
    const testRenderer = TestRenderer.create(<CodePushButton />);
    expect(CodePush.getUpdateMetadata).toHaveBeenCalled();
    await tick();
    // We expect that our state has not changed
    expect(testRenderer.root.instance.state.info).toBeUndefined();
    expect.assertions(2);
  });
  it('prints that a new version is available if version mismatches', () => {
    // We fake that a new version is available
    CodePush.sync = jest.fn((options, _, __, mismatchCb) => {
      mismatchCb(true);
    });
    // We press the sync button
    const testRenderer = TestRenderer.create(<CodePushButton />);
    testRenderer.root.children[0].props.onPress();
    expect(CodePush.sync).toHaveBeenCalled();
    expect(testRenderer.root.instance.state.mismatch).toEqual(true);
    // We expect our component to render that a new version is available
    expect(testRenderer).toMatchSnapshot();
  });
  test.each`
    status
    ${CodePush.SyncStatus.CHECKING_FOR_UPDATE}
    ${CodePush.SyncStatus.AWAITING_USER_ACTION}
    ${CodePush.SyncStatus.DOWNLOADING_PACKAGE}
    ${CodePush.SyncStatus.INSTALLING_UPDATE}
    ${undefined}
  `('prints $status', ({ status }) => {
    // We fake that a new version is available
    CodePush.sync = jest.fn((options, syncCb) => {
      syncCb(status);
    });
    // We press the sync button
    const testRenderer = TestRenderer.create(<CodePushButton />);
    testRenderer.root.children[0].props.onPress();
    expect(CodePush.sync).toHaveBeenCalled();
    expect(testRenderer.root.instance.state.status).toBeDefined();
    // We expect our component to render that a new version is available
    expect(testRenderer).toMatchSnapshot();
  });
});
