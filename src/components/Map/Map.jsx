import React, { Component,PureComponent }         from "react"
import { Map, TileLayer, AttributionControl, ZoomControl }   from "react-leaflet"
import URLs                         from "../../constants/URLs"
import { pure }                     from "recompose"
import { IDS }                      from "../../constants/Categories"
import STYLE                        from "../styling/Variables"
import styled                       from "styled-components";
import T                            from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import L from 'leaflet'
import { translate }          from "react-i18next";
import MarkerLayer from './MarkerLayer';

const { INITIATIVE, EVENT, COMPANY } = IDS;
import  "leaflet/dist/leaflet.css"

const munichBounds = L.latLngBounds(L.latLng(48.4,12.349), L.latLng(47.744,10.494));
var searchTimer = 0;


class KVMMap extends Component {

  getCategoryColorById(id){
    switch (id) {
      case INITIATIVE:
        return STYLE.initiative;
      case EVENT:
        return STYLE.event;
      case COMPANY:
        return STYLE.company;
      default:
        return STYLE.otherCategory;
    }
  }

  componentDidMount(){
    //workaround due to a bug in react-leaflet:
    const map = this.refs.map;
    if (map) {
      //map.fireLeafletEvent('load', map) 
      // map.leafletElement.addControl(L.control.zoom({position: 'bottomright'}))
      this.props.onMoveend(this.getMapCoordinates())
    }
  }

  getMapCoordinates(){
    const m = this.refs.map.leafletElement
    return {
      center: m.getCenter(),
      bbox  : m.getBounds(),
      zoom  : m.getZoom()
    }
  }

  _onMoveend () {
    this.props.onMoveend(this.getMapCoordinates()) 
  }

  _onZoomend () {
    this.props.onZoomend(this.getMapCoordinates()) 
  }

  render() {
  
    const {
      entries,
      center,
      zoom,
      onClick,
      onMarkerClick,
      showLocateButton,
      highlight
    } = this.props;


    let attribution = ""
    URLs.TILE_SERVER_ATTR.name ? attribution = '<a href="https://kartevonmorgen.org">♥ Karte von Morgen</a> | <a class="osm attr" href=' + URLs.TILE_SERVER_ATTR.link + '>' + URLs.TILE_SERVER_ATTR.name + '</a> | '  : null
    attribution += '&copy; <a class="osm attr" href=' + URLs.OSM_ATTR.link + '>' + URLs.OSM_ATTR.name + '</a>'

    return (
      <Wrapper>
        <Map
          ref         = 'map'
          center      = { center }
          //maxBounds   = { munichBounds.pad(0.3) }
          zoom        = { zoom }
          minZoom     = { 10 }
          maxZoom     = { 20 }
          zoomSnap    = { 1.0 }
          zoomControl = { false }
          className   = "map"
          attributionControl= {false}
          onMoveend   = { () => { this._onMoveend() }}
          onZoomend   = { () => { this._onZoomend() }}
          onClick     = { (e) => { onClick(e) }} >
          
          <AttributionControl prefix="" />
          <ZoomControl position="bottomright"  />

          <TileLayer
            url = { URLs.TILE_SERVER.link }
            attribution = { attribution }
            tileSize= { 512 }
            zoomOffset= { -1 }
          />

          <MarkerLayer
            entries={entries}
            highlight={highlight}
            onMarkerClick={onMarkerClick}
            zoom={zoom}
          />

        </Map>
        {showLocateButton ?
          <div className="leaflet-control-container">
            <LocateButtonContainer className="leaflet-right">
              <LocateButtonInnerContainer className = "leaflet-control-locate leaflet-bar leaflet-control">
                <LocateButton
                  className   = "leaflet-bar-part leaflet-bar-part-single" //"locate-icon"
                  onClick     = { this.props.onLocate }
                  title       = "Zeige meine Position" >
                  <LocateIcon icon="location-arrow" />
                </LocateButton>
              </LocateButtonInnerContainer>
            </LocateButtonContainer>
          </div>
          : null }
      </Wrapper>)
  }
}

KVMMap.propTypes = {
  entries       : T.array,
  highlight     : T.array,
  center        : T.object,
  zoom          : T.number,
  onClick       : T.func,
  onMoveend     : T.func,
  onZoomend     : T.func,
  onMarkerClick : T.func,
  onLocate      : T.func,
  showLocateButton : T.bool
};

module.exports = pure(KVMMap);

const Wrapper = styled.div`

  div.map {
    height: 100%;
    width: 100%;
    position: absolute;
    margin: 0;
    z-index: 0;
    padding: 0;
    top: 0;
    left: 0;
  }
  .osm.attr, .leaflet-control-attribution.leaflet-control a {
    color: ${ STYLE.darkGray }
  }
`;

const LocateButtonContainer = styled.div`
  bottom: 95px;
  position: absolute;
  z-index: 0;
`;

const LocateButtonInnerContainer = styled.div`
  box-shadow: none !important;
  width: 30px;
  height: 30px;
  border: 2px solid rgba(0,0,0,0.2);
  background-clip: padding-box;
`;

const LocateButton = styled.a `
  cursor: pointer;
  font-size: 14px;
  color: #333;
  width: 30px !important;
  height: 30px !important;
  line-height: 30px !important;
`;

const LocateIcon = styled(FontAwesomeIcon)`
  width: 12px;
  height: 12px;
`;