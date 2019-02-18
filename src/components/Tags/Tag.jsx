import styled from "styled-components";
import STYLE from "../styling/Variables";
import T from "prop-types";

const Tag = props => {
  const {onClick, text, clickable, quotes, t} = props;
  const className = text === t('transition.partnerTag') ? 'tag highlight' : 'tag';

  return (
    <TagLink
      clickable={clickable}
      onClick={clickable ? onClick : () => false}
      className={className}>
      {quotes
        ? <span>"{text}"</span>
        : <span>#{text}</span>
      }
    </TagLink>
  )
}

Tag.propTypes = {
  onClick: T.func,
  text: T.string,
  clickable: T.bool,
  quotes: T.bool,
  t: T.func.isRequired,
}

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
  line-height: 1.2em;
  
  &.highlight {
    color: white;
    background-color: ${STYLE.transitionOrange};
  }

  ${props => props.clickable && `
    cursor: pointer;

    &:hover {
      color: #fff;
      background-color: #333;
    }
    
    &.highlight:hover {
      color: white;
      background-color: ${STYLE.transitionOrangeDark};
    }
  `}
`

export default Tag;