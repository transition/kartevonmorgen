import {Tooltip} from "react-leaflet"
import STYLE from "../styling/Variables";
import styled from "styled-components";

const SmallTooltip = styled(Tooltip)`
  ${props => props.long && `
    white-space: normal !important;
    hyphens: auto;
  `}
  > span {
    color: ${ STYLE.initiative };
    font-size: 0.67rem;
    text-transform: uppercase;
  }
  > h3 {
    font-weight: bold;
    font-family: sans-serif;
    margin: 0;
    padding: 0;
    font-size: 0.75rem;
    ${props => props.long && `
      min-width: 12rem;
    `}
  }
`

module.exports = SmallTooltip;