// Copyright (c) 2015 - 2017 Markus Kohlhase <mail@markus-kohlhase.de>
import "./styling/Stylesheets"

import React, { Component } from "react"
import T                    from "prop-types"
import V                    from "../constants/PanelView"
import C                    from "../constants/Categories"
import Actions              from "../Actions"
import { readFromLocalStorage } from '../util/localStorage';
// import CityList             from "./CityList"
import Info                 from "./Info"
import Modal                from "./Modal"
import Map                  from "./Map/Map"
import Sidebar              from "./Sidebar"
import SearchBar            from "./SearchBar"
import LandingPageH          from "./LandingPage"
import { EDIT, RATING }     from "../constants/Form"
import URLs                 from "../constants/URLs"
import { pure }             from "recompose"
import { initialize }       from "redux-form"
import mapConst             from "../constants/Map"
import { translate }        from "react-i18next"
import NotificationsSystem  from "reapop";
import theme                from "reapop-theme-wybo";
import "./styling/Icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled, { keyframes, createGlobalStyle, ThemeProvider } from "styled-components";
import STYLE                from "./styling/Variables"
import Swipeable from 'react-swipeable'
import Loader from './Loader/Loader';
import pincloud from "../img/pincloud.png";
import store from "../Store";
import StartModal from './Transition/StartModal';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-120539306-2'); //Unique Google Analytics tracking number UA-120539306-1
ReactGA.set({ anonymizeIp: true });
ReactGA.set({ forceSSL: true });
ReactGA.pageview(window.location.hash);

class Main extends Component {

  escFunction(event){
    if(event.keyCode === 27) { //ESC
      const { view, dispatch}  = this.props
      if(view.menu) return dispatch(Actions.toggleLandingPage())
      if(!view.showLeftPanel) return dispatch(Actions.showLeftPanel());
      if(view.left === V.ENTRY) {
        dispatch(Actions.setCurrentEntry(null, null));
        dispatch(Actions.showSearchResults());
        return dispatch(Actions.setCenterInUrl(this.props.map.mapCenter));
      }
      if(view.left === V.RESULT){
        dispatch(Actions.setSearchText(''))
        return dispatch(Actions.search())
      }
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", (e) => this.escFunction(e), false)
    if(this.props.view.left === V.RESULT) this.props.dispatch(Actions.showStart())
    this.props.dispatch(Actions.getAllTags())

    // Add vh unit as custom css property
    // https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser#42965111
    this.updateStyle();
    // We listen to the resize event
    window.addEventListener('resize', this.updateStyle);
  }

  componentWillUnmount(){
    document.removeEventListener("keydown");
    window.removeEventListener('resize', this.updateStyle);
  }

  swipedLeftOnPanel() {
    this.props.dispatch(Actions.hideLeftPanel())
  }

  swipedRightOnMap(e, deltaX) {
    if( e.nativeEvent === undefined || e.nativeEvent.changedTouches === undefined) return true
    if(e.nativeEvent.changedTouches[0].pageX + deltaX < 26 ) this.props.dispatch(Actions.showLeftPanel())
  }

  updateStyle() {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  render(){
    const { dispatch, search, view, server, map, form, url, user, timedActions, t } = this.props;
    const { addresses } = search;
    const { entries, ratings } = server;
    let { showStartModal } = view;

    if (url.hash !== window.location.hash) {
      // console.log("URL CHANGE FROM APP: " + window.location.hash + " --> " + url.hash);
      window.history.pushState(null, null, window.location.pathname + url.hash);
    }

    const entriesArray = search.result.filter(e => entries[e.id]).map(e => entries[e.id]);
    const mapCenter = map.center;
    const loggedIn = user.username ? true : false;

    // // User marked start modal to be hidden
    // if (readFromLocalStorage('hideStartModal')) {
    //   showStartModal = false;
    // }

    return (
      <ThemeProvider theme={STYLE}>
        <StyledApp className="app">
          <GlobalStyle />
          <MainWrapper className="main">
            {showStartModal && <StartModal dispatch={dispatch} t={t} />}
            <NotificationsSystem theme={theme}/>
            {
              view.menu ?
                <LandingPageH
                  onMenuItemClick={ id => {
                    switch (id) {
                      case 'map':
                        return dispatch(Actions.toggleLandingPage());
                      case 'new':
                        dispatch(Actions.toggleLandingPage());
                        return dispatch(Actions.showNewEntry());
                      case 'landing':
                        dispatch(Actions.showInfo(null));
                        return dispatch(Actions.toggleLandingPage());
                      case V.LOGOUT:
                        dispatch(Actions.logout());
                        return dispatch(Actions.showInfo(V.LOGOUT));
                      case V.SUBSCRIBE_TO_BBOX:
                        return dispatch(Actions.showSubscribeToBbox());
                      default:
                        return dispatch(Actions.showInfo(id));
                    }
                  }}
                  onChange={ city => {
                    dispatch(Actions.setCitySearchText(city));
                    if (city && city.length > 3) {
                      return dispatch(Actions.searchCity());
                    }
                  }}
                  content={ view.right }
                  searchText={ search.city }
                  searchError={ search.error }
                  cities={ search.cities }
                  onEscape={ () => { return dispatch(Actions.setCitySearchText('')); }}
                  onSelection={ city => {
                    if (city) {
                      dispatch(Actions.setCenter({
                        lat: city.lat,
                        lng: city.lon
                      }));
                      dispatch(Actions.setZoom(mapConst.CITY_DEFAULT_ZOOM));
                      dispatch(Actions.toggleLandingPage());
                      dispatch(Actions.setSearchText(''));
                      return dispatch(Actions.finishCitySearch());
                    }
                  }}
                  onLogin={ data => {
                    var password, username;
                    username = data.username, password = data.password;
                    return dispatch(Actions.login(username, password));
                  }}
                  onRegister={ data => {
                    var email, password, username;
                    username = data.username, password = data.password, email = data.email;
                    return dispatch(Actions.register(username, password, email));
                  }}
                  loggedIn={ loggedIn}
                  user={ user}
                  onDeleteAccount={ () => {
                    return dispatch(Actions.deleteAccount());
                  }}
                />
                : ""
            }
            {
              view.modal != null ? <Modal view={view} dispatch={dispatch} /> : ""
            }

            {/* <Swipeable onSwipedLeft={ () => this.swipedLeftOnPanel() }> */}
            <LeftPanel className={"left " + (view.showLeftPanel && !view.menu ? 'opened' : 'closed')}>
              <div className={"search " + ((view.left === V.RESULT || view.left === V.START) ? 'open' : 'closed')}>
                <SearchBar
                  tags={search.tags}
                  searchText={search.text}
                  categories={search.categories}
                  type="integrated"
                  dispatch={dispatch}
                  start={view.left === V.START}
                  disabled={view.left === V.EDIT || view.left === V.NEW}
                  toggleCat={ c => {
                    if (c === C.IDS.EVENT) {
                      return dispatch(Actions.showFeatureToDonate("events"));
                    } else {
                      dispatch(Actions.toggleSearchCategory(c));
                      return dispatch(Actions.search());
                    }
                  }}
                  onChange={txt => {
                    if (txt == null) { txt = "" }
                    dispatch(Actions.setSearchText(txt));
                    dispatch(Actions.showSearchResults());
                    return dispatch(Actions.search());
                  }}
                  onPlaceSearch={txt => {
                    dispatch(Actions.setSearchText(''));
                    dispatch(Actions.showResultList());
                    dispatch(Actions.setCitySearchText(txt));
                    if (txt && txt.length > 3) {
                      return dispatch(Actions.searchCity());
                    }
                  }}
                  onEscape={ () => {
                    return dispatch(Actions.setSearchText(''));
                  }}
                  onEnter={ () => {}}      // currently not used, TODO
                  loading={ server.loadingSearch || server.entriesLoading }
                  user={ user }
                />
              </div>

              <div className={'content-wrapper ' + ((view.left === V.ENTRY || view.left === V.EDIT || view.left === V.EDIT) ? 'full' : 'with-search')}>
                <Sidebar
                  view={ view }
                  search={ search }
                  map={ map }
                  user={ user }
                  form={ form }
                  entries={entries}
                  entriesArray={ entriesArray }
                  ratings={ ratings }
                  // LeftPanelentries={ server.entries } never used…?
                  dispatch={ dispatch }
                  t={ t }
                />
              </div>
            </LeftPanel>
            {/* </Swipeable> */}

            <HiddenSidebar>
              <button
                onClick={ () => {
                  if (view.showLeftPanel) {
                    return dispatch(Actions.hideLeftPanel());
                  } else {
                    return dispatch(Actions.showLeftPanel());
                  }
                }}>
                <ToggleLeftSidebarIcon icon={"caret-" + (view.showLeftPanel ? 'left' : 'right')} />
              </button>
            </HiddenSidebar>

            {/* <RightPanel>
              <div className="menu-toggle">
                <button onClick={()=>{
                  dispatch(Actions.setSearchText(''));
                  return dispatch(Actions.showStart());
                }} >
                  <span>
                    <MenuFontAwesomeIcon icon={'bars'} />
                  </span>
                </button>
              </div>
            </RightPanel>  */}

            <Swipeable onSwipedRight={ (e, deltaX) => this.swipedRightOnMap(e, deltaX) } className="center">
              <Loader loading={ !view.showLeftPanel && (server.loadingSearch || server.entriesLoading) }></Loader>
              <Map
                highlight={ search.highlight }
                center={ mapCenter}
                zoom={ map.zoom}
                category={ form[EDIT.id] ? form[EDIT.id].category ? form[EDIT.id].category.value : null : null}
                entries={entriesArray}
                onClick={ (event) => {
                  if(event.originalEvent.srcElement.tagName.toLowerCase() === 'path') return false;

                  //back to overview
                  if(view.left === V.ENTRY)
                  {
                    dispatch(Actions.setCurrentEntry(null, null));
                    dispatch(Actions.showSearchResults());
                    dispatch(Actions.setCenterInUrl(mapCenter));
                  }

                  dispatch(Actions.hideLeftPanelOnMobile());
                  return dispatch(Actions.setMarker(event.latlng));
                }}
                onMarkerClick={markerId => {
                  if (view.left === V.EDIT || view.left === V.NEW) return false;
                  dispatch(Actions.setCurrentEntry(markerId, null));
                  dispatch(Actions.showLeftPanel());
                }}
                onMoveend={ coordinates => { return dispatch(Actions.onMoveend(coordinates, map.center)); }}
                onZoomend={ coordinates => { return dispatch(Actions.onZoomend(coordinates, map.zoom)); }}
                onLocate={ () => { return dispatch(Actions.showOwnPosition()); }}
                showLocateButton={ true }
              />
            </Swipeable>
          </MainWrapper>
        </StyledApp>
      </ThemeProvider>
    );
  }
}

Main.propTypes = {
  view :          T.object.isRequired,
  server :        T.object.isRequired,
  map:            T.object.isRequired,
  search :        T.object.isRequired,
  form :          T.object.isRequired,
  url:            T.object.isRequired,
  user :          T.object.isRequired,
  timedActions :  T.object.isRequired
};

module.exports = translate('translation')(pure(Main))

/* Moved all styles here. TODO: Move to right components */


const GlobalStyle = createGlobalStyle`
  
  @media only screen and (max-width: 600px) {
    body { font-size:80%;}
  }

  h1, h2, h3, h4, h5, h6, h7 {
    font-family: ${STYLE.headerFont};
    font-weight: 500;
  }
  
  html, button, input, select, textarea {
    font-family: ${STYLE.bodyFont};
  }
`;


// Create the keyframes
const fadein = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const MainWrapper = styled.div `
  height: 100vh;
`

const MenuFontAwesomeIcon = styled(FontAwesomeIcon)`
  padding-right: .45rem;
`;

const ToggleLeftSidebarIcon = styled(FontAwesomeIcon) `
  margin-right: 0.3em;
  width: 0.7em;
`

const LeftPanel = styled.div `
  position: relative;
  z-index: 2;
  order: -1;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  overflow-y: hidden;
  float: left;
  background-color: #fff;
  box-shadow: 1px 1px 5px rgba(0,0,0,.5);
  .content-wrapper {
    &.with-search {
      height: calc(100vh - 54px);
      height: calc(var(--vh, 1vh) * 100 - 54px);
    }
    &.full {
      height: 100vh;
      height: calc(var(--vh, 1vh) * 100);
    }
    .result {
      box-sizing: border-box;
      padding-bottom: 30px;
      overflow: auto;
    }
    .content-above-buttons {
      overflow-y: scroll;
      overflow: auto;
      height: calc(100vh - 42px);
      box-sizing: border-box;
      padding-bottom: 30px;
    }
    .content {
      overflow-y: scroll;
      overflow: auto;
      height: inherit;
      width: 100%;
      box-sizing: border-box;
      position: absolute;
      display: flex;
      flex-direction: column;
    }
  }
  &.closed {
    width: 0;
  }
  &.opened {
    max-width: 380px;
    @media only screen and (min-width: 1000px) { max-width: 420px; }
    
    width: 92%;
    .menu {
      width: 100%;
    }
  }
  .search {
    &.closed {
      display: none;
    }
  }
  nav {
    &.menu {
      z-index: 10;
      padding: 0;
      margin: 0;
      background: ${STYLE.coal};
      text-align: center;
      position: absolute;
      bottom: 0;
      li {
        cursor: pointer;
        box-sizing: border-box;
        font-weight: normal;
        padding: 0.3em;
        font-size: 1.2em;
        border: none;
        color: ${STYLE.lightGray};
        background: transparent;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        &:hover {
          color: #fff;
          border-bottom: 4px solid #fff;
        }
        i {
          margin-right: 0.5em;
        }
      }
    }
    &.menu-top {
      top: 0;
      display: flex;
      flex-direction: row;
      padding: 9pt 6pt 8pt 7pt;
    }
  }
`
/*
const RightPanel = styled.div `
  position: absolute;
  top: 15px;
  right: 0;
  background: #fff;
  color: ${STYLE.coal};

  .menu-toggle button {
    outline: none;
    position: relative;
    z-index: 1;
    top: 0;
    right: 0;
    font-size: 15pt;
    text-transform: uppercase;
    text-align: right;
    color: ${STYLE.darkGray};
    background: #fff;
    border-radius: 0.2em 0 0 0.2em;
    border: none;
    padding: 0.2em;
    box-shadow: 0 1px 3px 0.2px rgba(0,0,0,0.5);
    &:hover {
      color: ${STYLE.coal};
      box-shadow: 0 1px 3px 0.2px #000;
    }
    .pincloud {
      display: inline-block;
      width: 3.5em;
      height: 1.2em;
      background-position: left;
      background-image: url(${pincloud});
      background-repeat: no-repeat;
      background-size: 50%;
    }
    i {
      margin-right: 0.3em;
    }
  }
`*/

const HiddenSidebar = styled.div `
  position: relative;
  z-index: 2;
  height: 0;
  >button {
    position: relative;
    padding: 10px 3px 10px 7px;
    top: 72px;
    font-size: 13pt;
    color: ${STYLE.darkGray};
    background: #fff;
    border: none;
    border-left: 1px solid ${STYLE.lightGray};
    border-radius: 0 0.2em 0.2em 0;
    box-shadow: 2px 1px 4px 0 rgba(0,0,0,.4);
    &:hover {
      color: ${STYLE.coal};
      box-shadow: px 2px 2px 0.3px #000;
    }
    i {
      margin-right: 0.3em;
    }
  }
`

const StyledApp = styled.div `

  background: #fff;
  min-height: 100vh;
  height: 100vh;

  .tutorial {
    margin-bottom: 3em;
    img { width: 100%; }
  

  button {
    font-family: ${STYLE.bodyFont};
    &.pure-button i {
      margin-right: 0.5em;
    }
  }

  .fa {
    font-family: "FontAwesome" !important;
  }

  .pure-g [class *= "pure-u"] {
    font-family: ${STYLE.bodyFont};
  }

  /* ============================== */
  /* SCROLLBAR */
  ::-webkit-scrollbar {
    background-color: #eee;
  }
  ::-webkit-scrollbar-thumb {
    /* //Instead of the line below you could use @include border-radius($radius, $vertical-radius) */
    border-radius: 0;
    background-color: #ccc;
  }

  .pure-menu-list {
    margin: 0 50px;
  }

  .pure-menu-link:hover {
    color: #000;
  }


  label span.desc {
    color: ${STYLE.darkGray};
    font-size: 0.8em;
    margin-left: 0.5em;
  }
  legend span.desc {
    color: ${STYLE.darkGray};
    font-size: 0.8em;
    margin-left: 0.5em;
  }



  /* ======= FORM */
  form {
    div.err {
      color: #f44;
      font-size: 0.9em;
    }
    input[type="text"].err {
      border-color: #f44;
    }
    textarea.err {
      border-color: #f44;
    }
    select.err {
      border-color: #f44;
    }
  }
  /* ======= */

  /* ======= BANNER */
  .banner {
    position: relative;
    z-index: 10;
    color: #eee;
    text-align: center;
    padding-top: 1em;
    padding-bottom: 1em;
    .banner-link {
      color: #000;
    }
  }
  /* ======= */

  /* ======= CHEVRON */
  div.chevron {
    position: relative;
    color: ${STYLE.lightGray};
    i {
      position: absolute;
      display: inline-table;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
  /* ======= */


  /* ======= MISC */

  .close-button {
    text-align: center;
    margin: 0;
    padding: 1em;
    button {
      margin: 0 5px;
    }
  }
  .message {
    white-space: pre-wrap;
    margin: 0;
    padding: 1em;
  }
  .new-rating-form {
    margin: 2em 1.8em 1.8em 1.8em;

    .radio-button {
      margin: 0.2em 0.3em 0.2em 0;
    }
    .form-heading {
      font-weight: bold;
      margin-top: 0.5em;
      margin-bottom: 0;
    }
    .rating-context-explanation {
      margin-top: 0.5em;
      margin-bottom: 0.5em;
      font-style: italic;
    }
    .title {
      margin-bottom: 0.5em;
    }
  }
  .optional::placeholder {
    color: #777;
  }
  input, textarea, select {
    box-shadow: none !important;
    border-radius: 3px !important;
  }
  .info {
    .landing-img {
      width: 70%;
    }
    h3 {
      margin-top: 50px;
    }
  }
  .license input {
    margin-top: 0.7em;
  }
}
`