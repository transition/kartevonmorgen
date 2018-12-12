import React, { Component } from "react";
import styled from "styled-components";
import STYLE from "./styling/Variables"
import { pure } from "recompose";
import Actions from "../Actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Tag from "./Tags/Tag"

class TransitionStart extends Component {


  _onClick(e) {
    e.preventDefault();
    this.props.dispatch(Actions.showSearchResults());
    this.props.dispatch(Actions.setSearchText(e.target.innerText || e.target.textContent));
    return this.props.dispatch(Actions.search());
  }

  render(){

    return(
      <div className="content">
        <div className="entry">

          <EntryDetailPage>
            <header>
              <img src="https://transition-muc.de/wp-content/uploads/2018/05/map@2x-150x150.png" />
              <h1>Transition Map<br/> Prototyp</h1>
            </header>
            <br/><hr/>
            <p>Schön das du da bist und schön, dass es so viele tolle Projekte und Läden gibt in dieser Stadt!</p>
            <p>
              
              <ul>
                <li>Suchst du einen <Tag clickable={ true } onClick={(e) => this._onClick(e)} text="secondhandladen"/>?</li>
                <li>Toaster kaputt? Ab zum <Tag clickable={ true } onClick={(e) => this._onClick(e)} text="repaircafe"/></li>
                <li>Zu viel Plastik in deinem Leben? Hier gibt's Dinge auch <Tag clickable={ true } onClick={(e) => this._onClick(e)} text = "verpackungsfrei" /></li>
                <li>Nur ein kleiner Umzug? Hier gibt's kostenlose <Tag clickable={ true } onClick={(e) => this._onClick(e)} text = "lastenradverleih" /></li>
              </ul>              
            </p> 
            <hr/><br/>
            <p>Wir sind noch fleißig am testen und zusammen mit der <a href="http://kartevonmorgen.org/" target="_blank">Karte Von Morgen</a> am weiterentwickeln.</p>
            <p><i>Wenn du Probleme hast</i> oder dir ein Feature fehlt – Meld dich gern bei <a href="mailto:botho@serlo.org">Botho</a>. </p>
            <p><i>Wenn dir ein Eintrag fehlt:</i><br/><a href="#" onClick = {(e) => { e.preventDefault(); this.props.dispatch(Actions.showNewEntry()) }}>Leg ihn gerne an</a>, Vielen Dank!</p>
            <p><b>Viel Spaß beim testen!</b></p>
            <br/>
            <div style={{marginTop:'3rem', opacity:0.8, fontSize:'0.75rem', marginBottom:'5rem'}}>
              <hr/>
              <ul>
                <li>Zur <a href="https://transition-muc.de" target="_blank">Webseite von Transition München</a></li>
                <li>Zum <a href="https://munich.impacthub.net/impressum/" target="_blank">Impressum</a></li>
                <li>Für die Nutzung der Karte gilt die Datenschutzerklärung der <a href="https://www.kartevonmorgen.org" target="_blank">Karte Von Morgen</a></li>
              </ul>
            </div>

          </EntryDetailPage>
        </div>
      </div>
    )}

}


module.exports = (TransitionStart)

const EntryDetailPage = styled.div`
z-index: 2;
position: relative;
padding: 1.5rem 1em 0 1em;
max-width: 500px;
background-color: #fff;
margin-top: ${props => props.hasImage ? "244px" : "0"};
line-height: 1.4;

> header {
  text-align: center;
  color: ${STYLE.initiative};
}

a {
  color: ${STYLE.initiative};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

a.tag {
  font-size: 1rem;
  &:hover {
    text-decoration: none;
  }
}

hr{
  box-shadow: none;
  outline: 0;
  border: 0;
  border-bottom: 1px solid gray;
  margin: 1rem 0;
}
`;

