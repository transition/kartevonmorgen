import React, { Component } from "react";
import Select, { Creatable, components }  from 'react-select';
import request from "superagent/lib/client";
import { translate } from "react-i18next";
import normalize from "../util/normalize";
import { OFDB_API }  from "../constants/URLs"
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const TagOption = (props) => {
  return (
    <div {...props.innerProps} className={ props.data.type + " tag-wrapper " + (props.isFocused ? "hightlight" : "") }>
      { props.data.type === "place" ? <FontAwesomeIcon icon="building" /> : null }
      { props.data.type === undefined ? <FontAwesomeIcon icon="map-marker-alt" /> : null }
      { props.data.type === "tag" ? <FontAwesomeIcon icon="tag" /> : null }
      <components.Option {...props}/>
    </div>
  );
};

const defaultTags = [{
  "value": "restaurants",
  "label": "restaurants",
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



class SearchInput extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      allOptions: [],
      options: [],
      inputValue: ''
    };
    
    //TODO: List of Tags should probably be loaded with the WebAPI or use Async react-select
    
    request
      .get( OFDB_API.link +'/tags/')
      .accept('json')
      .end((err, response) => {
        if (err) {
          console.error(err);
        }
        if (response.body) {
          let options = []
          for (var i = 0; i < response.body.length; i++) {
            options[i] = {
              "value": response.body[i],
              "label": response.body[i],
              "type": "tag"
            }
          } 
          this.setState({
            allOptions: options
          })
        }
      });
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
      res = this.state.allOptions.filter(function(d) {
        return d.label.match( searchString );
      });
    }
    
    res = res.slice(0, 5)

    let output = [
      {
        label: "Tags",
        value: "tags", //bug
        options: res
      }
    ]

    if( input.length > 2 ) {
      output.push({
        label: "Orte",
        value: "orte",
        options: [{
          label: "Nach Orten suchen…",
          value: " " + input,
          __isNew__: true,
          type: "place"
        }]
      })
    }
    
    this.setState({
      options: output,
      inputValue: input
    })

  }

  valueToArray() {
    if(!this.props.searchText) return null

    if( typeof this.props.searchText !== "string") return this.props.searchText

    const out = this.props.searchText.split(',').map( val => {
      val = val.replace("#","");
      return {value: val, label: val, type: "tag" }
    })
    return out
  }

  _onChange(values,event){
    if(event.option && event.option.type === "place") return this.props.onPlaceSearch(event.option.value)
    console.log(event)
    let string = ''
    for (let i = 0; i < values.length; i++) {
      string += (values[i].type==="tag" ? "#" : "") + values[i].value + ",";
    }
    console.log(string)
    return this.props.onChange(string.slice(0,-1))
  }

  // valueToString(newValue,event) {
    
  //   switch(newValue.type){
  //     case "tag":

  //       break;

  //     case "place":
  //       this.onPlaceSearch
  //       break;
  //   }

  //   return(newValue);

  //   const val = newValue  // ? newValue : this.props.input.value
  //   if( typeof val === "string" ) return val

  //   const currentTagsArray = this.props.input.value.split(',')


  //   let arr = []
  //   for (let i = 0; i < val.length; i++) {
  //     const normalized = normalize.tags(val[i].value)
  //     if ( normalized==false ) continue
      
  //     const isNew = (i == (val.length -1) && event.action == "create-option")
  //     if (isNew ) if (currentTagsArray.indexOf(normalized) != -1 ) return false

  //     arr.push( normalized )
  //   }
  //   console.log(arr);
  //   // cb( arr.join(',') );
  // }

  validate(input) {
    return (input.length > 1 )
  }

  render(){

    return(
      <StyledCreatable
        {...this.props}

        components={{ Option: TagOption }}

        isClearable={false}
        isMulti={true}
        
        maxMenuHeight={800}

        classNamePrefix="search-input"
        options={ this.state.options }
          
        placeholder={this.props.t("entryForm.tags")}
        noOptionsMessage={() => this.props.t("entryForm.noTagSuggestion") }
        formatCreateLabel={(inputValue) => 'Nach "' + inputValue +'" suchen…' }
        createOptionPosition="first"
        getOptionLabel={ (obj) => obj.__isNew__ ? obj.label : "#"+obj.label } 

        onInputChange={this.onInputChange.bind(this)}
        filterOption={ () => true}
        onChange={ (values,event) => this._onChange(values,event) }
        onBlur={event => event.preventDefault()}
        
        value={ this.valueToArray() }
      />
    )
  }
}


module.exports = translate('translation')(SearchInput)


const StyledCreatable = styled(Creatable) `
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
        
  }

  .tag-wrapper .search-input__option{
    display: inline-block;
    width: calc(100% - 3rem);
    margin-left: 1rem;
    cursor: pointer;
  }

  .tag-wrapper.tag {
    padding: .2rem;
    cursor: pointer;
  }

  .tag-wrapper.tag .search-input__option, .search-input__multi-value{
    font-size: .9em !important;
    display: inline !important;
    background: #eaeaea !important;
    color: #333 !important;
    border-radius: .3em !important;
    padding: .2em 0.4em !important;
    margin-right: .4em !important;
    border: 0 !important;
    letter-spacing: .06em;
    line-height: 1em;
  }
  .search-input__multi-value{
    display: flex !important;
  }

  .tag-wrapper.tag:hover .search-input__option, .tag-wrapper.tag.hightlight .search-input__option {
      color: #fff !important;
      background-color: #333 !important;
    }

  .tag-wrapper.hightlight .search-input__option {
    background-color: transparent;
    font-weight: bold;
    .search-input__option {
      background-color: transparent;
    }
  }

  svg.svg-inline--fa {
    margin-left: 1rem;
  }

`;
