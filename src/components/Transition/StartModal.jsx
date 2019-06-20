import React from "react";
import styled from "styled-components";
import { writeToLocalStorage } from '../../util/localStorage';
import Actions from "../../Actions";
import Tag from "../Tags/Tag"

const StartModal = (props) => {
  const { dispatch, t } = props;

  function onHideModalInFutureClick(e) {
    const checked = e.target.checked;
    if (checked) {
      writeToLocalStorage('hideStartModal', checked);
    }
  }

  function onModalClose() {
    dispatch(Actions.onStartModalToggle());
  }

  function onTagClick(e) {
    e.preventDefault();
    onModalClose();
    dispatch(Actions.showSearchResults());
    dispatch(Actions.setSearchText(e.target.innerText || e.target.textContent));
    return dispatch(Actions.search());
  }

  return (
    <ModalHolder>
      <Overlay onClick={() => onModalClose()}/>
      <Modal>
        <Header>
          <Brand>
            <Logo src="https://transition-muc.de/wp-content/uploads/2018/05/map@2x-150x150.png"/>
            <H1>Transition Map<br/> Prototyp</H1>
          </Brand>
          <H2>Schön, dass Du da bist! Es gibt schon viele tolle Projekte und Läden in Deiner Stadt!</H2>
          <Button type="button" className="btn-close" onClick={() => onModalClose()}>X</Button>
        </Header>
        <Body>
          <TagList>
            <Tag clickable={true}
                 onClick={(e) => onTagClick(e)}
                 text="klamottenkaufen" t={t} />
            <Tag clickable={true}
                 onClick={(e) => onTagClick(e)}
                 text="frühstückengehen"
                 t={t}/>
            <Tag clickable={true}
                 onClick={(e) => onTagClick(e)}
                 text="mittagessengehen"
                 t={t}/>
            <Tag clickable={true}
                 onClick={(e) => onTagClick(e)}
                 text="abendessengehen"
                 t={t}/>
            <Tag clickable={true}
                 onClick={(e) => onTagClick(e)}
                 text="inscafegehen" t={t}/>
            <Tag clickable={true}
                 onClick={(e) => onTagClick(e)}
                 text="eisessengehen" t={t}/>
            <Tag clickable={true}
                 onClick={(e) => onTagClick(e)}
                 text="lebensmittelbesorgen" t={t}/>
            <Tag clickable={true}
                 onClick={(e) => onTagClick(e)}
                 text="lastenradverleih" t={t}/>
          </TagList>
          <Button type="button" className="btn-explore" onClick={() => onModalClose()}>Karte erkunden</Button>
        </Body>
        <Footer>
          {/*<CheckBoxLabel>*/}
          {/*  <CheckBox*/}
          {/*    name="isGoing"*/}
          {/*    type="checkbox"*/}
          {/*    onChange={(e) => onHideModalInFutureClick(e)} />*/}
          {/*  zukünftig nicht mehr zeigen*/}
          {/*</CheckBoxLabel>*/}
          <LinkList>
            <Link href="https://transition-muc.de" target="_blank">Transition München</Link> |
            <Link href="https://munich.impacthub.net/impressum/" target="_blank">Impressum</Link> |
            <Link href="https://transition-muc.de/privacy-policy/" target="_blank">Datenschutz</Link>
          </LinkList>
        </Footer>
      </Modal>
    </ModalHolder>
  )
}

export default StartModal;

const ModalHolder = styled.div`
  z-index: 10001;
  width: 100%;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  position: fixed;
  display: flex;
  align-content: center;
  justify-content: center;
  left: 0;
  top: 0;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: inherit;
  height: inherit;
  background-color: rgba(0, 0, 0, .75);
  transition: background-color linear .3s;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, .55);
  }
`;

const Modal = styled.div`
  position: relative;
  z-index: 2;
  background-color: ${({ theme }) => theme.white};
  line-height: 1.4;
  color: ${({ theme }) => theme.text};
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0,0,0,.2);
  display: flex;
  flex-direction: column;
  @media (min-width: 576px) {
    border-radius: 10px;
    max-width: 400px;
    align-self: center;
  }
`;

const Header = styled.div`
  position: relative;
  padding: 30px 15px;
  background-color: ${({ theme }) => theme.lightGray};
  @media (min-width: 576px) {
    border-radius: 10px 10px 0 0;
  }
`;

const Brand = styled.div`
  display: flex;
`;

const Logo = styled.img`
  width: 30px;
  height: 31px;
  margin-right: 10px;
`;

const H1 = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.transitionOrange};
`;

const H2 = styled.h2`
  font-weight: 400;
  font-size: 16px;
  margin: 25px 0 0;
  line-height: 1.6;
`;

const H3 = styled.h3`
  margin: 45px 0 30px;
  font-weight: 600;
  font-size: 16px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 15px 45px;
  align-items: center;
`;

const Footer = styled.div`
  width: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  align-self: end;
  align-content: center;
  justify-content: center;
  padding: 14px 15px;
  background-color: ${({ theme }) => theme.lightGray};
  font-size: 10px;
  margin-top: auto;
  text-align: center;
  @media (min-width: 576px) {
    border-radius: 0 0 10px 10px;
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 20px 0;
  @media (min-height: 600px) {
    margin: 40px 0 50px;
  }
  a {
    width: calc(50% - 10px);
    padding: 8px 3px;
    margin: 5px 0;
    font-size: 12px;
    text-align: center;
    font-weight: 600;
    overflow-wrap: break-word;
    word-wrap: break-word;
    -ms-word-break: break-all;
    word-break: break-word;
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;
    @media (min-width: 560px) {
      width: calc(50% - 22px);
      word-break: normal;
      padding: 8px 8px;
    }
    span {
      color: ${({ theme }) => theme.transitionOrange};  
    }
    &:hover, &:active,
    &:hover span, &:active span {
      color: ${({ theme }) => theme.white};
      background-color: ${({ theme }) => theme.transitionOrangeDark};
    }
  }
`;

const Button = styled.button`
  padding: 9px 14px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.transitionOrange};
  border-radius: 4px;
  border: none;
  &:hover, &:active {
      background-color: ${({ theme }) => theme.transitionOrangeDark};
  }
  &.btn-close {
    background-color: transparent;
    color: ${({ theme }) => theme.text};
    position: absolute;
    border: 0;
    top: 0;
    right: 0;
  }
`;

const Link = styled.a`
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  margin: 0 3px;
  &:hover, &:active {
    text-decoration: underline;
  }
`;

const LinkList = styled.div`
  display: flex;
  justify-content: center;
`;

const CheckBoxLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-size: 10px;
`;

const CheckBox = styled.input`
  margin-right: 6px;
`;


