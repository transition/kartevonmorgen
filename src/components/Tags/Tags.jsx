import {Component} from "react";
import styled from "styled-components";
import Actions from "../../Actions";
import Tag from "./Tag";
import T from "prop-types";

class Tags extends Component {
  render() {
    const {tags, dispatch, t} = this.props;
    return (
      <TagsWrapper key="tags">
        <TagList>
          {tags.filter(tag => tag !== '').map((tag, tagKey) =>
            <TagListElem key={'TagListElem' + tagKey}>
              <Tag clickable={true}
                   onClick={() => {
                     dispatch(Actions.showSearchResults());
                     dispatch(Actions.setSearchText('#' + tag));
                     return dispatch(Actions.search());
                   }}
                   text={tag}
                   t={t}/>
            </TagListElem>
          )}
        </TagList>
      </TagsWrapper>
    )
  }
}

Tags.propTypes = {
  tags: T.array.isRequired,
  dispatch: T.func.isRequired,
  t: T.func.isRequired,
}

const TagsWrapper = styled.div `
  margin-top: 1.5em;
`;

const TagList = styled.ul `
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TagListElem = styled.li `
  display: inline;
`;

export default Tags;