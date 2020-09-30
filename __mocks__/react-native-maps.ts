const React = require.requireActual('react');
const MapView = require.requireActual('react-native-maps');

class MockCallout extends React.Component {
  render() {
    return React.createElement('Callout', this.props, this.props.children);
  }
}

class MockMarker extends React.Component {
  render() {
    return React.createElement('Marker', this.props, this.props.children);
  }
}

class MockMapView extends React.Component {
  render() {
    return React.createElement('MapView', this.props, this.props.children);
  }
}

MockCallout.propTypes = MapView.Callout.propTypes;
MockMarker.propTypes = MapView.Marker.propTypes;
MockMapView.propTypes = MapView.propTypes;
MockMapView.Marker = MockMarker;
MockMapView.Callout = MockCallout;
module.exports = MockMapView;
