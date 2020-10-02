import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import CodePush from 'react-native-code-push'; // @codepush

interface State {
  info?: string;
  status?: string;
  mismatch: boolean;
}

const styles = StyleSheet.create({
  newVersion: {
    fontSize: 11,
  },
  button: {
    marginLeft: 5,
  },
  status: {
    fontSize: 12,
  },
  info: {
    fontSize: 8,
    maxWidth: 150,
  },
});

export class CodePushButton extends Component<unknown, State> {
  public state = {
    info: undefined,
    status: undefined,
    mismatch: false,
  };

  public componentDidMount() {
    CodePush.getUpdateMetadata().then((update): void => {
      if (!update) return;
      let info = update.label;
      if (update.description) {
        info += ' (' + update.description + ')';
      }
      this.setState({
        info,
      });
    });
  }

  private lookForUpdate = () => {
    CodePush.sync(
      {
        updateDialog: {
          appendReleaseDescription: true,
          descriptionPrefix: '\n\nChangelog:\n',
        },
        installMode: CodePush.InstallMode.IMMEDIATE,
      },
      (SyncStatus): void => {
        switch (SyncStatus) {
          case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
            this.setState({ status: 'Checking for update' });
            break;
          case CodePush.SyncStatus.AWAITING_USER_ACTION:
            this.setState({ status: 'Awaiting action' });
            break;
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            this.setState({ status: 'Downloading' });
            break;
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            this.setState({ status: 'Installing' });
            break;
          default:
            this.setState({ status: 'No update found' });
        }
      },
      undefined,
      (mismatch): void => mismatch && this.setState({ mismatch: true })
    );
  };

  public render() {
    if (this.state.mismatch) {
      return <Text style={styles.newVersion}>New version on AppCenter</Text>;
    }

    return (
      <TouchableOpacity style={styles.button} onPress={this.lookForUpdate}>
        <Text style={styles.status}>{this.state.status || 'Check update'}</Text>
        {!!this.state.info && (
          <Text style={styles.info} numberOfLines={3}>
            {this.state.info}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}
