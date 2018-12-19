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
            <p>Schön, dass du da bist und schön, dass es so viele tolle Projekte und Läden gibt in dieser Stadt!</p>
            <ul>
              <li>Suchst du einen <Tag clickable={ true } onClick={(e) => this._onClick(e)} text="secondhandladen"/>?</li>
              <li>Soll's doch neu sein, aber fair? Hier geht's zu den <Tag clickable={ true } onClick={(e) => this._onClick(e)} text = "klamottenladen" /></li>
              <li>Nur ein kleiner Umzug? Kostenlose Ladenräder gibt's im <Tag clickable={ true } onClick={(e) => this._onClick(e)} text = "lastenradverleih" /></li>
              {/* <li>Toaster kaputt? Ab zum <Tag clickable={ true } onClick={(e) => this._onClick(e)} text="repaircafe"/></li> */}
              <li>Zu viel Plastik in deinem Leben? Hier kannst du <Tag clickable={ true } onClick={(e) => this._onClick(e)} text = "unverpackt" />einkaufen</li>
            </ul>              
            <hr/><br/>
            <p>Wir sind noch fleißig am Weiterentwickeln zusammen mit der <a href="http://kartevonmorgen.org/" target="_blank">Karte Von Morgen</a>.</p>
            <p><i>Wenn du Probleme hast</i> oder dir ein Feature fehlt – Meld dich gern bei <a href="mailto:botho@serlo.org">Botho</a>. </p>
            <p><i>Wenn dir ein Eintrag fehlt:</i><br/><a href="#eintrag_eintragen" onClick = {(e) => { e.preventDefault(); this.props.dispatch(Actions.showNewEntry()) }}>Leg ihn gerne an</a>, Vielen Dank!</p>
            <p><b>Viel Spaß beim <a href="#einträge" onClick={(e)=>{ e.preventDefault(); this.props.dispatch(Actions.showResultList()); }}>Ausprobieren!</a></b></p>
            <br/>
            <div style={{marginTop:'3rem', opacity:0.8, fontSize:'0.75rem', marginBottom:'5rem'}}>
              <hr/>              
              <p><a href="https://transition-muc.de" target="_blank">Webseite von Transition München</a> | <a href="https://munich.impacthub.net/impressum/" target="_blank">Impressum</a></p>
              <p>Für die Nutzung der Karte gilt die Datenschutzerklärung der <br/><a href="https://www.kartevonmorgen.org" target="_blank">Karte Von Morgen</a>.</p>
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

