import {NAMES} from "../../constants/Categories";
import {Component} from 'react';
import {translate} from "react-i18next";
import {pure} from "recompose"
import SmallTooltip from './SmallTooltip';

class LongTooltip extends Component {
  /**
   * Get limited text
   * @param text
   * @returns {*}
   */
  getLimitedText(text) {
    if (text.length > 110) {
      text = text.substring(0, 91 + text.substring(90).indexOf('.')) + ' …'
    }

    return text;
  }

  render() {
    const {title, description, categories, t, offset} = this.props,
      limitedDesc = this.getLimitedText(description);

    return (
      <SmallTooltip long={true} direction='bottom' offset={[0, offset]}>
        <React.Fragment>
          <span>{t('category.' + NAMES[categories && categories[0]])}</span>
          <h3>{title}</h3>
          <p>{limitedDesc}</p>
        </React.Fragment>
      </SmallTooltip>
    )
  }
}

module.exports = translate('translation')(pure(LongTooltip))