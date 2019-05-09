import {PureComponent} from 'react';
import {pure} from 'recompose'
import {Marker} from 'react-leaflet'
import {isEqual} from 'lodash';
import L from 'leaflet'
import T from 'prop-types';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import LongTooltip from './LongTooltip';
import SmallTooltip from './SmallTooltip';

require('react-leaflet-markercluster/dist/styles.min.css');
// TODO: Style with styled-component (which did not work)
import './MarkerLayer.css';

class MarkerLayer extends PureComponent {
  state = {
    markers: [],
  };

  /**
   * Get marker icon
   * @param integer size
   * @param boolean [highlight]
   * @returns {L.Icon}
   */
  getMarkerIcon(size, highlight = false) {
    const markerIcon = highlight ? 'marker-highlighted.svg' : 'marker.svg';
    return new L.Icon({
      iconUrl: require('../../img/map/' + markerIcon),
      iconRetinaUrl: require('../../img/map/' + markerIcon),
      iconSize: [size, size],
    });
  }

  /**
   * Get marker object
   * @param entry
   * @param highlight
   * @param markerSize
   * @returns {{id, opacity: number, highlighted: boolean, title, categories: *|categories|{default}|initialState.categories|Function, description, size: *, icon: L.Icon, position: {lat, lng}}}
   */
  getMarkerObject(entry, highlight, markerSize) {
    const highlighted = highlight.indexOf(entry.id) === 0;
    return {
      id: entry.id,
      opacity: 1,
      highlighted: highlighted,
      title: entry.title,
      categories: entry.categories,
      description: entry.description,
      size: markerSize,
      icon: this.getMarkerIcon(markerSize, highlighted),
      position: {
        lat: entry.lat,
        lng: entry.lng,
      }
    }
  }

  /**
   * Update markers (and state)
   * @param entries
   * @param highlight
   * @param zoom
   */
  updateMarkers(entries, highlight, zoom) {
    // Exit if no entries or empty
    if (!entries || entries.length === 0) {
      return;
    }

    const markerSize = 12 + (zoom - 9) * 4;
    let newMarkers = [];

    // Add markers for each entry
    for (let entry of entries) {
      newMarkers = [
        ...newMarkers,
        this.getMarkerObject(entry, highlight, markerSize),
      ]
    }
    // Update state
    this.setState({markers: newMarkers});
  }

  /**
   * Update marker highlight
   * @param highlight
   */
  updateMarkerHighlight(highlight) {
    const markerId = highlight && highlight.length > 0 ? highlight[0] : null;

    this.setState({
      markers: this.state.markers.map(marker => {
        // Set new active
        if (markerId && marker.id === markerId) {
          const highlighted = !marker.highlighted;
          return Object.assign({}, marker, {
            highlighted,
            icon: this.getMarkerIcon(marker.size, highlighted)
          });
        }
        // Reset previous
        else if (marker.highlighted === true) {
          const highlighted = !marker.highlighted;
          return Object.assign({}, marker, {
            highlighted,
            icon: this.getMarkerIcon(marker.size, highlighted)
          });
        }
        // Default
        return marker;
      })
    });
  }

  /**
   * On component did update check changes
   * @param prevProps
   */
  componentDidUpdate(prevProps) {
    // If entries changed
    if (!isEqual(prevProps.entries, this.props.entries)) {
      const {entries, highlight, zoom} = this.props;
      this.updateMarkers(entries, highlight, zoom);
    }
    // If highlight changed
    else if (!isEqual(prevProps.highlight, this.props.highlight)) {
      const {highlight} = this.props;
      this.updateMarkerHighlight(highlight);
    }
  }

  render() {
    return (
      <React.Fragment>
        <MarkerClusterGroup disableClusteringAtZoom={12}>
          {this.state.markers.map(marker => {
            return (
              <Marker
                key={marker.id}
                onClick={() => this.props.onMarkerClick(marker.id)}
                position={marker.position}
                icon={marker.icon}
                opacity={marker.opacity}>
                { marker.highlighted
                  ? <SmallTooltip
                      permanent={true}
                      direction='bottom'
                      offset={[0, 20]}>
                      <h3>{marker.title}</h3>
                    </SmallTooltip>
                  : <LongTooltip
                      title={marker.title}
                      description={marker.description}
                      categories={marker.categories}
                      offset={20}/>
                }
              </Marker>
            )
          })}
        </MarkerClusterGroup>
      </React.Fragment>
    )
  }
}

MarkerLayer.propTypes = {
  entries: T.array.isRequired,
  highlight: T.array.isRequired,
  onMarkerClick: T.func.isRequired,
  zoom: T.number.isRequired,
};

module.exports = pure(MarkerLayer);