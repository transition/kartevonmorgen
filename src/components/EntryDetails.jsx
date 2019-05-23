import React, { Component }   from "react";
import BusinessCard           from "./BusinessCard";
import { pure }               from "recompose";
import styled                 from "styled-components";
import NavButtonWhite         from "./NavButtonWhite";
import EntryImage             from "./EntryImage";
import { translate }          from "react-i18next";
import Actions                from "../Actions";

const LoadingEntryMessage = styled.div`
  margin: 3em 2em !important;
`;

const Navbar = styled.nav`
  position: relative;
  z-index: 1;
  background: ${props => props.hasImage ? "linear-gradient(to bottom, rgba(0,0,0,0.17) 0%, rgba(0,0,0,0) 100%)" : "none"};
`;

class EntryDetails extends Component {

  render() {
    const { entry, t, dispatch, mapCenter, userRole } = this.props;
    const hasImage = entry ? (entry.image_url ? true : false) : false;
    if (!entry) {
      return(
        <LoadingEntryMessage>
          {t("entryDetails.loadingEntry")}
        </LoadingEntryMessage>
      );
    }
    else {
      return (
        <div className="entry">
          <Navbar hasImage={hasImage} className="menu-top">
            <NavButtonWhite
              keyName = "back"
              buttonRight = { false }
              icon = "chevron-left"
              text = {t("entryDetails.back")}
              onClick = {() => {
                this.props.dispatch(Actions.setCurrentEntry(null, null));
                this.props.dispatch(Actions.showSearchResults());
                this.props.dispatch(Actions.setCenterInUrl(mapCenter));
              }}
              aboveImage={hasImage}
            />
            {userRole === 'editor' &&
              <NavButtonWhite
                keyName = "edit"
                buttonRight = { true }
                icon = "pencil-alt"
                text = ""
                onClick = {() => {
                  this.props.dispatch(Actions.editCurrentEntry());
                }}
                aboveImage={hasImage}
              />}
          </Navbar>
          {
            hasImage ?
              <EntryImage image_url={entry.image_url} image_link_url={entry.image_link_url} />
              : null
          }
          <BusinessCard entry={entry} hasImage={hasImage} dispatch={dispatch} />
        </div>)
    }
  }
}

module.exports = translate('translation')(pure(EntryDetails))