import React, { Component,PureComponent }         from "react"
import { Map, TileLayer, Marker, CircleMarker, Tooltip, AttributionControl, ZoomControl }   from "react-leaflet"
import URLs                         from "../constants/URLs"
import { pure }                     from "recompose"
import { IDS }                      from  "../constants/Categories"
import STYLE                        from "./styling/Variables"
import { avg_rating_for_entry }     from "../rating"
import styled                       from "styled-components";
import T                            from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import L from 'leaflet'
import { translate }          from "react-i18next";
import { NAMES }    from "../constants/Categories"

const { INITIATIVE, EVENT, COMPANY } = IDS;
import  "leaflet/dist/leaflet.css"


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

  render() {
  
    const {
      entries,
      center,
      zoom,
      marker,
      onMoveend,
      onZoomend,
      onClick,
      onMarkerClick,
      ratings,
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
          zoom        = { zoom }
          zoomSnap    = { 1.0 }
          zoomControl = { false }
          className   = "map"
          attributionControl= { false }
          onMoveend   = { (e) => { onMoveend(this.getMapCoordinates()) }}
          onZoomend   = { (e) => { onZoomend(this.getMapCoordinates()) }}
          onClick     = { (e) => { onClick(e) }} >
          
          <AttributionControl prefix={false} />
          <ZoomControl position="bottomright"  />

          <TileLayer
            url = { URLs.TILE_SERVER.link }
            attribution = { attribution }
            prefix= ''
          />

          <MarkerLayer
            entries = { entries }
            ratings = { ratings }
            highlight = { highlight }
            onMarkerClick = { onMarkerClick }
            marker = { marker }
            zoom = { zoom }
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
  ratings       : T.object,
  highlight     : T.array,
  center        : T.object,
  zoom          : T.number,
  marker        : T.object,
  onClick       : T.func,
  onMoveend     : T.func,
  onZoomend     : T.func,
  onMarkerClick : T.func,
  onLocate      : T.func,
  showLocateButton : T.bool
};

module.exports = pure(KVMMap);



class MarkerLayer extends PureComponent {

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

  getIcon(size) {
    const helper = size/2

    return new L.Icon({
      iconUrl: require('../img/marker.svg'),
      iconRetinaUrl: require('../img/marker.svg'),
      iconSize: [size, size]
      // ??? iconAnchor: [helper, size],
      // popupAnchor: [0, 100]
    });
  }


  render() {

    let markersArray = []
    //return markersArray;
    const { entries, ratings, highlight, onMarkerClick, marker, zoom } = this.props
    const markerSize = 18+ (zoom-9)*6

    if (entries && entries.length > 0 ) {
      entries.forEach(e => {
        let avg_rating = null;

        const isHighlight = highlight.length > 0 && highlight.indexOf(e.id) == 0

        if(e.ratings.length > 0 && Object.keys(ratings).length > 0){
          const ratings_for_entry = (e.ratings || []).map(id => ratings[id]);
          avg_rating = avg_rating_for_entry(ratings_for_entry);
        }

        if(e.ratings.length > 0 && avg_rating && avg_rating > 0){
          let opacity = 0.5;
          if(highlight.indexOf(e.id) == 0 || highlight.length == 0) opacity = 1;

          
          markersArray.push(
            <Marker
              key       = { e.id }
              onClick   = { () => { onMarkerClick(e.id) }}
              position  = {{ lat: e.lat, lng: e.lng }}
              icon      = { this.getIcon(markerSize) }
              opacity   = { opacity }
            >
              { !isHighlight ? <LongTooltip entry={ e } offset={20} /> : null }
            </Marker>
          );
        } else {
          // to make clicking the circle easier add a larger circle with 0 opacity:

          let opacity = 0.5;
          if(highlight.indexOf(e.id) == 0 || highlight.length == 0) opacity = 1;

          const circleSize = markerSize/5

          markersArray.push(
            <CircleMarker
              onClick   = { () => { onMarkerClick(e.id) }}
              key       = { e.id }
              center    = {{ lat: e.lat, lng: e.lng }}
              opacity   = { 1 }
              radius    = { circleSize }
              color     = { "#fff" }
              weight    = { 0.7 }
              fillColor = { this.getCategoryColorById(e.categories[0]) }
              fillOpacity = { opacity }
            > 
              { !isHighlight ? <LongTooltip entry={ e } offset={8} /> : null }
            </CircleMarker>
          );
        }

        if(isHighlight){

          markersArray.push(
            <CircleMarker
              onClick   = { () => { onMarkerClick(e.id) }}
              key       = { e.id + "-highlight"}
              center    = {{ lat: e.lat, lng: e.lng }}
              opacity   = { 0 }
              fillOpacity = { 0 }
            > 
              <SmallTooltip permanent={true} direction='bottom' offset={[0, 20]}><h3>{e.title}</h3></SmallTooltip>
            </CircleMarker>);
        }
      });
    }  
    return(
      <React.Fragment>
        { markersArray }
        { marker
          ? <Marker position = { marker } icon = { this.getIcon(40) } />
          : null
        }
      </React.Fragment>
    )
  }
}

class _LongTooltip extends Component {


  render() {
    const { entry, t, offset } = this.props
    let desc = entry.description;
    if(desc.length > 110) desc = desc.substring(0,91 + desc.substring(90).indexOf(".") ) + ' …'
    if(desc.length > 120) desc = desc.substring(0,91 + desc.substring(90).indexOf(" ") ) + ' …'
  
     
    return(
      <SmallTooltip long={true} direction='bottom' offset={[0, offset]}>
        <React.Fragment>
          <span>{t("category." + NAMES[entry.categories && entry.categories[0]])}</span>
          <h3>{entry.title}</h3>
          <p>{desc}</p>
        </React.Fragment>
      </SmallTooltip>            
    )
  }
}

const LongTooltip = translate('translation')(pure(_LongTooltip))


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

const SmallTooltip = styled(Tooltip)`
  
  ${props => props.long && `
    white-space: normal !important;
    hyphens: auto;
  `}
  > span {
    color: ${ STYLE.initiative };
    font-size: 0.67rem;
    text-transform: uppercase;
  }
  > h3 {
    font-weight: bold;
    font-family: sans-serif;
    margin: 0;
    padding: 0;
    font-size: 0.75rem;
    ${props => props.long && `
      min-width: 12rem;
    `}
  }
`