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
      
      <FontAwesomeIcon icon={icon} />
      
      { isTag
        ? <Tag clickable={true} text={props.data.value} />
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
      ? <Tag {...props} clickable={false} text={props.data.value} />
      : <Tag {...props} clickable={false} text={props.data.value} quotes={true}/>
  );
};

const defaultTags = [{
  "value": "restaurant",
  "label": "restaurant",
  "type": "tag"
},{
  "value": "klamotten",
  "label": "klamotten",
  "type": "tag"
},{
  "value": "stadtrundgang",
  "label": "stadtrundgang",
  "type": "tag"
},{
  "value": "umwelt",
  "label": "umwelt",
  "type": "tag"
},{
  "value": "lastenrad",
  "label": "lastenrad",
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
    
    res = res.slice(0, 5)

    let output = []

    if( input.length > 2 ) {
      output.push({
        label: this.props.t("searchbar.searchForPlaceholder").replace("%1",input),
        value: input,
        __isNew__: true,
        type: "search"
      })
      output.push({
        label: this.props.t("searchbar.placesPlaceholder"),
        value: " " + input,
        __isNew__: true,
        type: "place"
      })
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

        isClearable={true}
        isMulti={true}
        
        maxMenuHeight={700}

        classNamePrefix="search-input"
        options={ this.state.options }
          
        placeholder={this.props.t("searchbar.placeholder")}
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
  border: 1px solid rgba(0,0,0,0.1) !important;
  border-radius: 0 !important;
  font-size: 1.1em !important;
  line-height: 1.7em !important;
  font-weight: 500;
  padding: .3em 0;
  
  > .search-input__control, > .search-input__control--is-focused {
    border: 0 !important;
    border-radius: 0;
    box-shadow: none;
  }

  > .search-input__menu {
      z-index:20;
  }

  .search-input__value-container {
    padding-left: 2.5em !important;

    .tag {
      font-size: .9em !important;
    }
  }

`;


const _TagOption = styled.div `

  padding-left: 2rem;
  cursor: pointer;
  display: block;
  line-height: 2.5rem;
  background-color: ${props => props.isFocused ? "rgba(0,152,137,0.15)" : "#fff"};

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
  }

  .tag svg{
    fill: #ccc;
  }

  ${props => props.isFocused && `  
    background-color: rgba(0,152,137,0.15);
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