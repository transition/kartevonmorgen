import React, { Component } from "react";
import styled from "styled-components";
import STYLE from "./styling/Variables"
import { pure } from "recompose";
import Actions from "../Actions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class TransitionStart extends Component {

  render(){

    return(
      <div className="content">
        <div className="entry">

          <EntryDetailPage>
            <header style={{textAlign:"center",color:"#c66666"}} >
              <img src="https://transition-muc.de/wp-content/uploads/2018/05/map@2x-150x150.png" />
              <h1>Transition Map Prototyp</h1>
            </header>
            <br/><hr/>
            <p>Schön das du da bist und schön, dass es so viele tolle Projekte und Läden gibt in dieser Stadt!</p>
            <p>Suchst du z.B. einen <a onClick={ (e) => {e.preventDefault();
              this.props.dispatch(Actions.showSearchResults());
              this.props.dispatch(Actions.setSearchText('#verpackungsfrei'));
              return this.props.dispatch(Actions.search());
            }} href="#" >verpackungsfreien Laden</a>?
            Oder interessierst du dich für <a onClick={ (e) => { e.preventDefault();
              this.props.dispatch(Actions.showSearchResults());
              this.props.dispatch(Actions.setSearchText('#bienen'));
              return this.props.dispatch(Actions.search());
            }}href="#" >Bienen</a>? 
            </p> 
            <hr/><br/>
            <p>Wir sind noch fleißig am testen und zusammen mit der <a href="http://kartevonmorgen.org/">Karte Von Morgen</a> am weiterentwickeln.</p>
            <p><i>Wenn du Probleme hast</i> oder dir ein Feature fehlt – Meld dich gern bei <a href="mailto:botho@serlo.org">Botho</a>. </p>
            <p><i>Wenn dir ein Eintrag fehlt:</i><br/><a href="#" onClick = {(e) => { e.preventDefault(); this.props.dispatch(Actions.showNewEntry()) }}>Leg ihn gerne an</a>, Vielen Dank!</p>
            <p><b>Viel Spaß beim testen!</b></p>
            
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

a {
  color: ${STYLE.initiative};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
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

