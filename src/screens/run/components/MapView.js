import React, { useMemo } from 'react';
import { View, StyleSheet, Modal, Image } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { isEmpty } from 'lodash';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Button } from 'src/components';
import theme from 'src/theme';
import { selectors } from 'src/models';
import { ImageAssets } from 'src/assets';

const stylesMap = {
  lineLayer: {
    lineColor: theme.colors.button.primary,
    lineCap: 'round',
    lineJoin: 'round',
    lineWidth: 5,
  },
};

const MapView = props => {
  const { visible, onClose } = props;
  const currentLocations = useSelector(selectors.run.currentLocations);
  const { bottom } = useSafeAreaInsets();

  const mapLocations = useMemo(() => {
    if (isEmpty(currentLocations)) return [];
    return currentLocations.map(location => [
      location.longitude,
      location.latitude,
    ]);
  }, [currentLocations]);

  const centerLocation = useMemo(() => {
    if (isEmpty(mapLocations)) return [70, 70];
    return mapLocations[0];
  }, [mapLocations]);

  MapboxGL.setAccessToken(
    'pk.eyJ1IjoidGhhaW1hdWl0IiwiYSI6ImNsMnZtYTh4MDBkOXMzaW1wcG1kdm16Z3oifQ.Et18TJR1D24TOkqAKCw2qQ',
  );
  return (
    <Modal transparent visible={visible}>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.mapView}>
          <MapboxGL.Camera centerCoordinate={centerLocation} zoomLevel={17} />
          <MapboxGL.ShapeSource
            id="source1"
            lineMetrics={true}
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: mapLocations,
              },
            }}>
            <MapboxGL.LineLayer id="layer1" style={stylesMap.lineLayer} />
          </MapboxGL.ShapeSource>
          <MapboxGL.UserLocation>
            <MapboxGL.SymbolLayer
              id={'custom-user-symbol'}
              style={{
                iconImage: ImageAssets.currentLocation,
                iconRotationAlignment: 'map',
                // iconAllowOverlap: true,
                iconSize: 0.1,
              }}
            />
          </MapboxGL.UserLocation>
        </MapboxGL.MapView>
        <View style={[styles.closeView, { bottom: bottom + 20 }]}>
          <Button
            style={styles.closeBtn}
            icon={{ name: 'close', color: '#fff', size: 20 }}
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
};

MapView.propTypes = {};

export default React.memo(MapView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeView: {
    position: 'absolute',
    bottom: 50,
    left: '40%',
    right: '40%',
    alignItems: 'center',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  mapView: {
    flex: 1,
  },
  currentLocation: {
    width: 30,
    height: 30,
  },
});
