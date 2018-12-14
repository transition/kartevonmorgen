import React, { Component }   from "react"
import PropTypes              from "prop-types"
import styled                 from "styled-components"

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: -2.6rem;
  width: 100%;
  min-height: 13rem;
  
  z-index: 0;
  border-bottom: 1px solid #ddd;
`;

const Image = styled.img`
  width: 100%;
  max-width:  100%;
  max-height: 20rem;
`;

class EntryImage extends Component {

  _onLoad(e) {
    const img = e.target;
    const natural = img.naturalWidth / img.naturalHeight;
    const client = img.clientWidth / img.clientHeight;
    
    if( (img.naturalWidth / img.clientWidth) < 0.8 || Math.abs(natural-client) > 0.1 ) {
      img.style.width = "auto";
    }
  }

  render(){
    const { image_url, image_link_url } = this.props;

    return (
      <ImageWrapper>
        { image_link_url ?
          <a href={ image_link_url } target="_blank">
            <Image src={image_url} onLoad={(e) => { this._onLoad(e) }}></Image>
          </a>
          :
          <Image src={image_url} onLoad={(e) => { this._onLoad(e) }}></Image>
        }
      </ImageWrapper>
    );
  }
}

EntryImage.propTypes = {
  image_url:     PropTypes.string.isRequired,
  image_link_url:    PropTypes.string
}

export default EntryImage