import './style.scss';

import PropTypes from 'prop-types';
import {PureComponent} from 'react';

export default class extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
    value: PropTypes.any,
    itemHeight: PropTypes.number,
    columnHeight: PropTypes.number,
    onChange: PropTypes.func
  };

  static defaultProps = {
    itemHeight: 36,
    columnHeight: 200
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
    let nextScrollerTranslate = this._initialTranslate + this._offsetY;
    if (nextScrollerTranslate < minTranslate) {
      nextScrollerTranslate = minTranslate - Math.pow(minTranslate - nextScrollerTranslate, 0.8);
    } else if (nextScrollerTranslate > maxTranslate) {
      nextScrollerTranslate = maxTranslate + Math.pow(nextScrollerTranslate - maxTranslate, 0.8);
    }
    return nextScrollerTranslate;
  }

  get activeIndex() {
    const {items, itemHeight, value} = this.props;
    const {translate, minTranslate, maxTranslate} = this.state || {};
    const initialActiveIndex = items.indexOf(value);
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

  reset() {
    this._isMoving = false;
    this._startY = 0;
    this._initialTranslate = 0;
    this._offsetY = 0;
  }

  componentWillReceiveProps(nextProps) {
    if (!this._isMoving) {
      this.initialState(nextProps);
    }
  }

  initialState(inProps) {
    const {items, itemHeight, columnHeight} = inProps;
    this.state = {
      translate: columnHeight / 2 - itemHeight / 2 - this.activeIndex * itemHeight,
      minTranslate: columnHeight / 2 - itemHeight * items.length + itemHeight / 2,
      maxTranslate: columnHeight / 2 - itemHeight / 2
    };
  };
  

  handleTouchStart = (event) => {
    this._startY = event.targetTouches[0].pageY;
    this._initialTranslate = this.state.translate;
  };

  handleTouchMove = (event) => {
    event.preventDefault();
    this._offsetY = event.targetTouches[0].pageY - this._startY;
    this._isMoving = true;
    this.setState({translate: this.translate});
  };

  handleTouchEnd = (event) => {
    if (this._isMoving) {
      this.reset();
      const {items} = this.props;
      this.handleChange(items[this.activeIndex]);
    }
  };

  handleTouchCancel = (event) => {
    if (this._isMoving) {
      this.setState({translate: this._initialTranslate}, this.reset);
    }
  };

  handleItemClick = (option) => {
    if (option !== this.props.value) {
      this.handleChange(option);
    }
  };

  handleChange = inEvent => {
    this.props.onChange(inEvent)
  };

  renderItems() {
    const {items, value} = this.props;
    return items.map((option, index) => {
      const className = `react-select-item${option === value ? ' react-select-item-selected' : ''}`;
      return (
        <div
          key={index}
          className={className}
          style={this.itemStyle}
          onClick={() => this.handleItemClick(option)}>{option}</div>
      );
    });
  }

  render() {
    return (
      <div className="react-select">
        <div
          className="react-select-scroller"
          style={this.rootStyle}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onTouchCancel={this.handleTouchCancel}>
          {this.renderItems()}
        </div>
        <div className="react-select-highlight" style={this.highlightStyle}></div>
      </div>
    )
  }
}
