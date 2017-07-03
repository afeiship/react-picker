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
    let _translate = this.state.initialTranslate + this._offsetY;
    if (_translate < minTranslate) {
      _translate = minTranslate - Math.pow(minTranslate - _translate, 0.8);
    } else if (_translate > maxTranslate) {
      _translate = maxTranslate + Math.pow(_translate - maxTranslate, 0.8);
    }
    return _translate;
  }

  get activeIndex() {
    const {items, itemHeight} = this.props;
    const {translate, minTranslate, maxTranslate, value} = this.state || {};
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
    this._offsetY = 0;
    this.setState({
      initialTranslate: 0
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!this._isMoving) {
      this.initialState(nextProps);
      this.setState(this.state);
    }
  }

  initialState(inProps) {
    const {items, itemHeight, columnHeight} = inProps;
    this.state = {
      value: inProps.value,
      translate: columnHeight / 2 - itemHeight / 2 - this.activeIndex * itemHeight,
      minTranslate: columnHeight / 2 - itemHeight * items.length + itemHeight / 2,
      maxTranslate: columnHeight / 2 - itemHeight / 2
    };
  };


  handleTouchStart = (event) => {
    this._startY = event.targetTouches[0].pageY;
    this.setState({
      initialTranslate: this.state.translate
    })
  };

  handleTouchMove = (event) => {
    event.preventDefault();
    this._offsetY = event.targetTouches[0].pageY - this._startY;
    this._isMoving = true;
    this.setState({translate: this.translate});
  };

  handleTouchEnd = (event) => {
    if (this._isMoving) {
      const {items} = this.props;
      // this.reset();

      this.handleChange(items[this.activeIndex]);
      this.reset();
    }
  };

  handleTouchCancel = (event) => {
    if (this._isMoving) {
      this.setState({translate: this.state.initialTranslate}, this.reset);
    }
  };

  handleItemClick = (option) => {
    if (option !== this.state.value) {
      this.handleChange(option);
      this.setState({translate: this.translate});
    }
  };

  handleChange = inEvent => {
    this.props.onChange(inEvent)
  };

  renderItems() {
    const {items} = this.props;
    const {value} = this.state;
    return items.map((option, index) => {
      return (
        <div
          key={index}
          className={classNames('react-select-item', {'react-select-item-selected': option === value})}
          style={this.itemStyle}
          onClick={() => this.handleItemClick(option)}>{option}</div>
      );
    });
  }

  render() {
    const {className, items, itemHeight, columnHeight, ...props} = this.props;
    return (
      <div {...props} className={classNames('react-select', className)}>
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
