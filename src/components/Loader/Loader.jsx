import {PureComponent} from 'react';
import {SpinLoader} from 'react-loaders-spinners';
import {pure} from "recompose";
import styled from 'styled-components'

const StyledLoader = styled.div`
  z-index: 1010;
  position: fixed;
  top: 10px;
  right: 10px;
  > .dsgxWM {
    box-shadow: 0 0 15px rgba(0,0,0,.3);
  }
`

class Loader extends PureComponent {
  render() {
    return (
      this.props.loading &&
        <StyledLoader>
          <SpinLoader
            height={25}
            width={25}
            thickness={6}
            pColor="transparent"
            sColor="#c66666"
          />
        </StyledLoader>
    )
  }
}

module.exports = pure(Loader)