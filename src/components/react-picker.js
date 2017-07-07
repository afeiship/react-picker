import './style.scss';

import PropTypes from 'prop-types';
import {PureComponent} from 'react';
import classNames from 'classnames';
import objectAssign from 'object-assign';


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

  static normalizeItems(inItems) {
    const first = inItems[0];
    if (typeof first !== 'object') {
      return inItems.map((item, index) => {
        return {
          index,
          value: item,
          text: item
        };
      });
    }
    return inItems;
  };

  state = {};

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
    const {translate, minTranslate, maxTranslate} = this.state;
    switch (true) {
      case translate > maxTranslate:
        return 0;
      case translate < minTranslate:
        return items.length - 1;
      default:
        return -Math.floor((translate - maxTranslate) / itemHeight);
    }
  }


  get children() {
    const {items} = this.props;
    return items.map((item, index) => {
      return (
        <div
          key={index}
          className={classNames('react-picker-item', {'react-picker-item-selected': index === this.activeIndex})}
          style={this.itemStyle}
          data-value={item.value}
          data-index={index}
          onClick={this._onItemClick}>{item.text}</div>
      );
    });
  }

  getInitialActiveIndex(inProps) {
    const {items} = inProps;
    const {value} = objectAssign(this.state, inProps);
    let activeIndex = -1;
    items.forEach((item, index) => {
      if (item.value === value) {
        activeIndex = index;
      }
    });
    return activeIndex;
  }


  rollback() {
    this._isMoving = false;
    this._startY = 0;
    this._offsetY = 0;
    this.setState({
      initialTranslate: 0
    })
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
    const initialActiveIndex = this.getInitialActiveIndex(inProps);
    this.state = {
      value,
      translate: columnHeight / 2 - itemHeight / 2 - initialActiveIndex * itemHeight,
      minTranslate: columnHeight / 2 - itemHeight * items.length + itemHeight / 2,
      maxTranslate: columnHeight / 2 - itemHeight / 2
    };
  };

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
    this.setState({
      activeIndex: this.activeIndex,
      translate: this.translate
    });
  };

  _onTouchEnd = (inEvent) => {
    if (this._isMoving) {
      this._onChange();
      this.rollback();
    }
  };

  _onTouchCancel = (inEvent) => {
    if (this._isMoving) {
      this.rollback();
    }
  };

  _onItemClick = (inEvent) => {
    const index = inEvent.target.dataset.index * 1;
    const {itemHeight, columnHeight} = this.props;
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
    const {value} = items[this.activeIndex];

    if (this.state.value !== value) {
      this.state.value = value;
      this.initialState(objectAssign({...this.props}, this.state));
      this.setState(this.state, () => {
        onChange({target: {value}});
      });
    } else {
      this.initialState(objectAssign({...this.props}, this.state));
      this.setState(this.state);
    }
  };

  render() {
    const {className, value, items, itemHeight, columnHeight, ...props} = this.props;
    return (
      <div {...props} className={classNames('react-picker', className)}>
        <div className="react-picker-wrapper">
          <div
            className="react-picker-scroller"
            style={this.rootStyle}
            onTouchStart={this._onTouchStart}
            onTouchMove={this._onTouchMove}
            onTouchEnd={this._onTouchEnd}
            onTouchCancel={this._onTouchCancel}>
            {this.children}
          </div>
          <div className="react-picker-highlight" style={this.highlightStyle}></div>
        </div>
      </div>
    )
  }
}
