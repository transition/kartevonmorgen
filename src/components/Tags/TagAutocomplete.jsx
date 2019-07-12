import React, { Component } from "react";
import Select, { Creatable, components }  from 'react-select';
import request from "superagent/lib/client";
import { translate } from "react-i18next";
import styled from "styled-components";
import STYLE from "../styling/Variables"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import normalize from "../../util/normalize";
import { OFDB_API }  from "../../constants/URLs"
import Tag from "./Tag"


const TagOption = (props) => {

  const isTag=props.data.type === "tag"
  const isPlace=props.data.type === "place"

  let icon = "map-marker-alt"
  if(isTag) icon = "tag"
  if(isPlace) icon = "building"

  return (
    <_TagOption {...props.innerProps} isTag={isTag} isFocused={props.isFocused} >

      { !isTag ? <FontAwesomeIcon icon={icon} /> : null }

      { isTag
        ? <Tag clickable={true} text={props.data.value} t={props.selectProps.t} />
        : <a>{props.data.label}</a>
      }
    </_TagOption>
  );
};

const MultiTagContainer = (props) => {

  const isTag=props.data.type === "tag"
  const isPlace=props.data.type === "place"

  return (
    isTag
      ? <Tag {...props} clickable={false} text={props.data.value} t={props.selectProps.t} />
      : <Tag {...props} clickable={false} text={props.data.value} t={props.selectProps.t} quotes={false}/>
  );
};

const defaultTags = [{
  "value": "klamottenkaufen",
  "label": "klamottenkaufen",
  "type": "tag"
},{
  "value": "frühstückengehen",
  "label": "frühstückengehen",
  "type": "tag"
},{
  "value": "mittagessengehen",
  "label": "mittagessengehen",
  "type": "tag"
},{
  "value": "abendessengehen",
  "label": "abendessengehen",
  "type": "tag"
},{
  "value": "inscafegehen",
  "label": "inscafegehen",
  "type": "tag"
},{
  "value": "eisessengehen",
  "label": "eisessengehen",
  "type": "tag"
},{
  "value": "lebensmittelbesorgen",
  "label": "lebensmittelbesorgen",
  "type": "tag"
},{
  "value": "lastenradverleih",
  "label": "lastenradverleih",
  "type": "tag"
}
]


class TagAutocomplete extends Component {

  constructor(props) {
    super(props);

    this.state = {
      options: [ {
        label: this.props.t("searchbar.suggestions"),
        value: "taggroup",
        options: defaultTags
      }],
      inputValue: ''
    }

  }

  onInputChange(input) {
    this.customFilter(input)
  }

  customFilter(input) {

    let res
    if(input.length < 3){
      res = defaultTags
    }
    else {
      let searchString = input.toLowerCase().trim();
      res = this.props.allTags.filter(function(d) {
        return d.label.match( searchString );
      });
    }

    res = res.slice(0, 8)

    let output = []

    if( input.length > 2 ) {
      output.push({
        label: this.props.t("searchbar.searchForPlaceholder").replace("%1",input),
        value: input,
        __isNew__: true,
        type: "search"
      })
      // output.push({
      //   label: this.props.t("searchbar.placesPlaceholder"),
      //   value: " " + input,
      //   __isNew__: true,
      //   type: "place"
      // })
    }

    output.push(
      {
        label: this.props.t("searchbar.suggestions"),
        value: "taggroup",
        options: res
      })

    this.setState({
      options: output,
      inputValue: input
    })

  }

  valueToArray() {
    if(!this.props.searchText) return null

    if( typeof this.props.searchText !== "string") return this.props.searchText

    const out = this.props.searchText.split(',').map( val => {
      const isTag = ( val.indexOf("#") === 0 );
      val = val.replace("#","");
      return {value: val, label: val, type: isTag ? "tag" : "search" }
    })
    return out.splice(-1) // only use one until is done
  }

  _onChange(values,event){
    if(event.option && event.option.type === "place") return this.props.onPlaceSearch(event.option.value)

    if(!values) return false;
    values = values.slice(-1);
    if(values.length < 1) return this.props.onChange('')
    return this.props.onChange( (values[0].type==="tag" ? "#" : "") + values[0].value )

    // let string = ''
    // for (let i = 0; i < values.length; i++) {
    //   string += (values[i].type==="tag" ? "#" : "") + values[i].value + ",";
    // }
    // console.log(string.slice(0,-1))
    // return this.props.onChange(string.slice(0,-1))
  }


  validate(input) {
    return (input.length > 1 )
  }

  render(){

    return(
      <StyledSelect
        {...this.props}

        components={{ Option: TagOption, MultiValueContainer: MultiTagContainer }}

        isSearchable={this.props.userRole && this.props.userRole === 'editor'}
        isClearable={true}
        isMulti={true}

        maxMenuHeight={700}

        classNamePrefix="search-input"
        options={ this.state.options }

        //placeholder={this.props.t("searchbar.placeholder")}
        placeholder="Wähle einen Hashtag..."
        // noOptionsMessage={() => this.props.t("searchbar.noSuggestions") }
        // formatCreateLabel={(inputValue) => 'Nach "' + inputValue +'" suchen…' }
        // createOptionPosition="first"
        getOptionLabel={ (obj) => obj.__isNew__ ? obj.label : "#"+obj.label }

        onInputChange={this.onInputChange.bind(this)}
        filterOption={ () => true}
        onChange={ (values,event) => this._onChange(values,event) }
        onBlur={event => event.preventDefault()}

        delimiter = ","
        value={ this.valueToArray() }

        // styles={{ multiValue: base => ({ }) }}

      />
    )
  }
}


module.exports = translate('translation')(TagAutocomplete)


const StyledSelect = styled(Select) `
  ::placeholder{
    color: #aaa;
  }
  flex: 1;
  border: none !important;
  border-radius: 0 !important;
  //font-size: 1.1em !important;
  //line-height: 1.7em !important;
  //padding: .3em 0;
  font-weight: normal;
  
  > .search-input__control, > .search-input__control--is-focused {
    border: 0 !important;
    border-radius: 0;
    box-shadow: none;
  }

  > .search-input__menu {
      z-index:20;
      margin-top: 1px;
      border-radius: 0;
  }
  
  .search-input__control {
    position: initial;
    .search-input__value-container {
      input {
        padding: 10px 0;
      }
      .search-input__placeholder {
        font-size: 14px;
        @media (min-width: 560px) {
          font-size: 16px;
        }
      }
    }
  }

  .search-input__value-container {
    font-size: 1.2rem;

    .tag {
      margin-bottom: 0;
      @media (min-width: 560px) {
        font-size: 16px;
      }
    }
  }

`;


const _TagOption = styled.div `

  padding-left: 10px;
  cursor: pointer;
  display: block;
  line-height: 2.5rem;
  background-color: ${props => props.isFocused ? "#f3f3f3" : "#fff"};

  > a {
    display: inline-block;
  }

  .tag {
    font-size: .9em !important;
  }

  span {
    margin-right: .4rem;
  }

  svg.svg-inline--fa {
    position: absolute;
    margin-top: .75rem;
    margin-left: -1.5rem;
    opacity: ${props => props.isFocused ? "0.8" : "0.1"};
  }

  .tag svg{
    fill: #ccc;
  }

  ${props => props.isFocused && `  
    background-color: #f3f3f3;
    .tag {
        color: #fff;
        background-color: #333;
      }
  `}

  ${props => props.isTag && `

    &:hover .tag{
      color: #fff;
      background-color: #333;
    }
  `}
`
