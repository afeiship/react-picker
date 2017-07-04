import './style.scss';

import PropTypes from 'prop-types';
import {PureComponent} from 'react';
import classNames from 'classnames';


export default class extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.array,
    value: PropTypes.any,
    itemHeight: PropTypes.number,
    columnHeight: PropTypes.number,
    onChange: PropTypes.func
  };

  static defaultProps = {
    itemHeight: 36,
    columnHeight: 220
  };

  get itemStyle() {
    const {itemHeight} = this.props;
    return {
      height: itemHeight + 'px',
      lineHeight: itemHeight + 'px'
    }
  }

  get highlightStyle() {
    const {itemHeight} = this.props;
    return {
      height: itemHeight,
      marginTop: -(itemHeight / 2)
    }
  }

  get rootStyle() {
    const {columnHeight} = this.props;
    const translateString = `translate3d(0, ${this.state.translate}px, 0)`;
    const isMoving = this._isMoving;
    return {
      height: columnHeight,
      WebkitTransform: translateString,
      transform: translateString,
      transitionDuration: isMoving ? '0ms' : null
    };
  }

  get translate() {
    const {minTranslate, maxTranslate}  = this.state;
    let _translate = this.state.initialTranslate + this._offsetY;
    if (_translate < minTranslate) {
      _translate = minTranslate - Math.pow(minTranslate - _translate, 0.8);
    } else if (_translate > maxTranslate) {
      _translate = maxTranslate + Math.pow(_translate - maxTranslate, 0.8);
    }
    return _translate;
  }

  get activeIndex() {
    const {items, itemHeight, value} = this.props;
    const {translate, minTranslate, maxTranslate} = this.state || {};
    const initialActiveIndex = this.getIndex(items, value);
    switch (true) {
      case !translate:
        return initialActiveIndex === -1 ? 0 : initialActiveIndex;
      case translate > maxTranslate:
        return 0;
      case translate < minTranslate:
        return items.length - 1;
      default:
        return -Math.floor((translate - maxTranslate) / itemHeight);
    }
  }

  constructor(props) {
    super(props);
    this.initialState(props);
  }


  componentWillReceiveProps(nextProps) {
    if (!this._isMoving) {
      this.initialState(nextProps);
      this.setState(this.state);
    }
  }

  initialState(inProps) {
    const {items, itemHeight, value, columnHeight} = inProps;
    const activeIndex = this.getIndex(items, value);
    this.state = {
      translate: columnHeight / 2 - itemHeight / 2 - activeIndex * itemHeight,
      minTranslate: columnHeight / 2 - itemHeight * items.length + itemHeight / 2,
      maxTranslate: columnHeight / 2 - itemHeight / 2
    };
  };

  reset() {
    this._isMoving = false;
    this._startY = 0;
    this._offsetY = 0;
    this.setState({
      initialTranslate: 0
    })
  }

  getIndex(inItems, inValue) {
    let activeIndex = -1;
    inItems.forEach((item, index) => {
      if (item.value === inValue) {
        activeIndex = index;
      }
    });
    return activeIndex;
  }

  _onTouchStart = (event) => {
    this._startY = event.targetTouches[0].pageY;
    this.setState({
      initialTranslate: this.state.translate
    })
  };

  _onTouchMove = (event) => {
    event.preventDefault();
    this._offsetY = event.targetTouches[0].pageY - this._startY;
    this._isMoving = true;
    this.setState({translate: this.translate});
  };

  _onTouchEnd = (inEvent) => {
    if (this._isMoving) {
      this._onChange();
      this.reset();
    }
  };

  _onTouchCancel = (inEvent) => {
    if (this._isMoving) {
      this.reset();
    }
  };

  _onItemClick = (inEvent) => {
    const index = inEvent.target.dataset.index * 1;
    const {items, itemHeight, columnHeight} = this.props;
    if (index !== this.activeIndex) {
      this.setState({
        translate: columnHeight / 2 - itemHeight / 2 - index * itemHeight,
      }, () => {
        this._onChange();
      });
    }
  };

  _onChange = () => {
    const {items, onChange} = this.props;
    onChange({target: items[this.activeIndex]});
  };

  renderItems() {
    const {items} = this.props;
    return items.map((item, index) => {
      return (
        <div
          key={index}
          className={classNames('react-select-item', {'react-select-item-selected': index === this.activeIndex})}
          style={this.itemStyle}
          data-value={item.value}
          data-index={index}
          onClick={this._onItemClick}>{item.text}</div>
      );
    });
  }

  render() {
    const {className, value, items, itemHeight, columnHeight, ...props} = this.props;
    return (
      <div {...props} className={classNames('react-select', className)}>
        <div className="react-select-wrapper">
          <div
            className="react-select-scroller"
            style={this.rootStyle}
            onTouchStart={this._onTouchStart}
            onTouchMove={this._onTouchMove}
            onTouchEnd={this._onTouchEnd}
            onTouchCancel={this._onTouchCancel}>
            {this.renderItems()}
          </div>
          <div className="react-select-highlight" style={this.highlightStyle}></div>
        </div>
      </div>
    )
  }
}
