import React, { Component, ReactElement } from 'react'
import { StyleSheet, Text } from 'react-native'
import CodePush from 'react-native-code-push' // @codepush

import { theme } from 'theme'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'

interface State {
  info?: string
  mismatch: boolean
  status?: string
}

const styles = StyleSheet.create({
  newVersion: {
    fontSize: 11,
  },
  button: {
    position: 'absolute',
    right: 0,
    bottom: 20,
    backgroundColor: theme.colors.greyMedium,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderColor: theme.colors.white,
    borderWidth: 1,
    borderRightWidth: 0,
    padding: 10,
  },
  status: {
    fontSize: 12,
  },
  info: {
    fontSize: 8,
    maxWidth: 150,
  },
})

export class CodePushButton extends Component<unknown, State> {
  public state = {
    info: undefined,
    status: undefined,
    mismatch: false,
  }

  public componentDidMount(): void {
    CodePush.getUpdateMetadata().then((update): void => {
      if (!update) return
      let info = update.label
      if (update.description) {
        info += ' (' + update.description + ')'
      }
      this.setState({
        info,
      })
    })
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
            this.setState({ status: 'Checking for update' })
            break
          case CodePush.SyncStatus.AWAITING_USER_ACTION:
            this.setState({ status: 'Awaiting action' })
            break
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            this.setState({ status: 'Downloading' })
            break
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            this.setState({ status: 'Installing' })
            break
          default:
            this.setState({ status: 'No update found' })
        }
      },
      undefined,
      (mismatch): void => mismatch && this.setState({ mismatch: true })
    )
  }

  public render(): ReactElement {
    if (this.state.mismatch) {
      return <Text style={styles.newVersion}>Nouvelle version sur AppCenter</Text>
    }

    return (
      <TouchableOpacity testID="container" style={styles.button} onPress={this.lookForUpdate}>
        <Text style={styles.status}>{this.state.status || 'Check update'}</Text>
        {!!this.state.info && (
          <Text style={styles.info} numberOfLines={3}>
            {this.state.info}
          </Text>
        )}
      </TouchableOpacity>
    )
  }
}
