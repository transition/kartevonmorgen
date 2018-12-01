import React, { Component } from "react";
import styled from "styled-components";
import STYLE from "../styling/Variables"
import { pure } from "recompose";

class Tag extends Component {

  render(){
    const {onClick, text, clickable } = this.props

    return(
      <TagLink
        clickable={ clickable }
        onClick={ clickable ? onClick : () => false }
      >#{text}</TagLink>
    )
  }
}

module.exports = pure(Tag)

const TagLink = styled.a `
  color: #333;
  text-decoration: none;
  display: inline-block;
  background: #eaeaea;
  border: 0;
  border-radius: 0.3em;
  padding: .2em .4em;
  font-size: 0.75em;
  margin-bottom: 0.2rem;
  margin-right: 0.4em;
  letter-spacing: 0.06em;

  ${props => props.clickable && `
    cursor: pointer;

    &:hover {
      color: #fff;
      background-color: #333;
    }
  `}
`