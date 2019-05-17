import { translate } from "react-i18next";
import React from "react";
import { pure } from "recompose";
import T from "prop-types";
import { MAIN_IDS, CSS_CLASS_SIZE, NAMES } from "../constants/Categories";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import STYLE from "./styling/Variables"
import { SpinLoader } from 'react-loaders-spinners';
import TagAutocomplete from './Tags/TagAutocomplete';
import Actions              from "../Actions"

// class RawCategoryButtons extends React.Component {

//   render() {
//     const { disabled, active, onToggle, t } = this.props;
//     const buttons = MAIN_IDS.map((c) => {
//       const act = [].indexOf.call(active || [], c) >= 0;
//       return (
//         <button
//           key       = { c }
//           disabled  = { disabled }
//           onClick   = { () => { onToggle(c) }}
//           className = { NAMES[c] + " " + CSS_CLASS_SIZE[c] + (act ? " active" : "")}>
//           { t("category." + NAMES[c]) + " " }
//         </button>);
//     });
//     return (<div>{ buttons }</div>);
//   }
// }

// RawCategoryButtons.propTypes = {
//   active     : T.array,
//   disabled   : T.bool,
//   onToggle   : T.func
// };

// const CategoryButtons = pure(RawCategoryButtons);

class SearchBar extends React.Component {

  onChange = (ev) => {
    var ref, v;
    if ((v = (ref = ev.target) != null ? ref.value : void 0) == null) {
      return;
    }
    this.props.onChange(v);
  }

  onFocus = (ev) => {
    ev.target.select();
  }

  onKeyUp = (ev) => {
    ev.preventDefault();
    switch (ev.key) {
      case "Escape":
        this.props.onEscape();
        break;
      case "Enter":
        this.props.onEnter();
    }
  }

  render() {

    const { categories, disabled, toggleCat, searchText, t, loading, tags, dispatch, start, user } = this.props;
    const { role: userRole } = user;


    return (
      <Bar
        className = "SearchBar pure-g" integrated={this.props.type==="integrated"} standalone= {this.props.type==="standalone"} >
        {/*<MainCategories className = "main-categories pure-u-1 pure-g" standalone= {this.props.type==="standalone"}>
          
           <CategoryButtons
            active    = { categories }
            disabled  = { disabled   }
            onToggle  = { toggleCat  }
            t         = { t }
          /> 
        </MainCategories>*/}

        <div className = "pure-u-1 search-bar">
          <div onClick = { this.props.onLenseClick } className = "search-icon">
            { loading ?
              <SpinLoader
                height={17}
                width={17}
                thickness={3}
                pColor={STYLE.darkGray}
                sColor="white"
                onClick={()=>{ 
                  if(start) return dispatch(Actions.showResultList());
                  dispatch(Actions.setSearchText(''));
                  return dispatch(Actions.showStart());
                }}
              />
              : <button title="Zur Einführung" onClick={()=>{ 
                if(start) return dispatch(Actions.showResultList());
                dispatch(Actions.setSearchText(''));
                return dispatch(Actions.showStart());
              }} >
                <span>
                  <FontAwesomeIcon icon={'search'} />
                </span>
              </button>
            }
          </div>

          <TagAutocomplete
            onChange = { this.props.onChange }
            onPlaceSearch = { this.props.onPlaceSearch }
            searchText = { this.props.searchText }
            allTags = {tags}
            userRole={userRole}
          />
          {/* onChange    = { this.onChange }
            disabled    = { disabled }
            onKeyUp     = { this.onKeyUp }
            onFocus     = { this.onFocus }
            value       = { searchText || '' }
            className   = "pure-u-1"
            placeholder = { t("searchbar.placeholder") } /> */}
        </div>
      </Bar>)
  }
}

SearchBar.propTypes = {
  type        : T.oneOf(["standalone","integrated",""]),
  searchText  : T.string,
  categories  : T.array,
  disabled    : T.bool,
  toggleCat   : T.func,
  onChange    : T.func,
  onEnter     : T.func,
  onEscape    : T.func,
  t           : T.func
}

module.exports = translate('translation')(pure(SearchBar))


const borderRadius = '0.4em'

const MagnifyingGlassIcon = styled(FontAwesomeIcon)`
  margin: 0.1em 0 0 0.1em;
  animation-duration: 150ms;
  animation-name: turn;
  @keyframes turn {
    from {
      transform: rotate(330deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const MainCategories = styled.div `

  font-size: 1rem;
  color: #000;
  background-color: #eaeaea;
  
  button {
    padding: 0.6em;
    /* text-transform: uppercase; */
    /* background-color: #f7f7f7; */
  }
/*
  button > i.toggle {
    text-align: left;
    display: block;
    width: 1.8em;
    height: 0.9em;
    border: 1px solid #fff;
    border-radius: 0.5em;
    float: right;

    > i {
      display: inline-block;
      height: 0.9em;
      width: 0.9em;
      border-radius: 0.5em;
      background-color: #FFF;
      vertical-align: top;
      border: 1px solid #FFF;
      margin: -1px;
    }
  }

  button.active > i.toggle {
    text-align: right !important;
  }
*/
  ${props => props.standalone && `
    button:first-child {
      border-radius: ${borderRadius} 0 0 0;
    }
    button:last-child {
      border-radius: 0 ${borderRadius} 0 0;
    }
  `}

  .active{
    color: #fff;
    box-shadow: inset 0.2px 0.2px 2px 1px rgba(0, 0, 0, 0.4);
  }

  .initiative.active{
    background: ${STYLE.initiative};
  }

  .event.active {
    background: ${STYLE.event};
  }

  .company.active {
    background: ${STYLE.company};
  }
`

const Bar = styled.div `

  /* .main-categories {
    height: 2.4em;
  } */

  ${props => props.integrated && `
    border-bottom: 1px solid ${STYLE.lightGray};
  `}

  ${props => props.standalone && `
    box-shadow: 2px 2px 8px 4px rgba(0,0,0,0.6);
    border-radius: ${borderRadius};

    input{
      border-radius: 0 0 ${borderRadius} ${borderRadius};
    }
  `}

  width:         100%;
  box-sizing:    border-box;
  background:    #fff;

  input, button{
    box-sizing:  border-box;
    border:      none;
    outline: none;
  }

  input, span.search-icon {
    font-size: 1.2em;
  }

  input {
    padding: 0.4em;
    padding-left:  2em;
  }
  
  .search-bar {
     display: flex;
     align-items: center;
     justify-content: flex-start;
     border: 1px solid rgba(0,0,0,0.1);
  }
  

  .search-icon{
    width: 40px;
    z-index: 5;
    color: ${STYLE.darkGray};
    display: flex;
    align-items: center;
    justify-content: center;
    
    button {
      background: transparent;
    }

    svg {
      width: 1.2rem;
      height: 1.2rem;
    }
  }

  /* .search-icon{
    display: inline-block;
    font-size: 1.2rem;
    
  } */

  .locate-icon{
    margin-left: -2em;
    padding: 0.4em 0.6em;
  }

`