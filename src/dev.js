import Picker from './main';
import './dev.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items1: [
        {
          "text": "Mr.",
          "value": 0
        }, {
          "text": "Mrs.",
          "value": 1
        }, {
          "text": "Ms.",
          "value": 2
        }, {
          "text": "Dr.",
          "value": 3
        }, {
          "text": "Mr1.",
          "value": 4
        }, {
          "text": "Mrs1.",
          "value": 5
        }, {
          "text": "Ms1.",
          "value": 6
        }, {
          "text": "Dr1.",
          "value": 7
        }, {
          "text": "Mr2.",
          "value": 8
        }, {
          "text": "Mrs2.",
          "value": 9
        }, {
          "text": "Ms2.",
          "value": 10
        }, {
          "text": "Dr2.",
          "value": 11
        }
      ],
      value1: 1,
      value: 'Mr.',
      items2:[1,2,3,4,5,6,7,8,9,10,11,12],
      items: Picker.normalizeItems(['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Mr1.', 'Mrs1.', 'Ms1.', 'Dr1.', 'Mr2.', 'Mrs2.', 'Ms2.', 'Dr2.']),
    };
  }

  // Update the value in response to user picking event
  handleChange = (inEvent) => {
    const {value} = inEvent.target;
    // this.setState({value});
    console.log('change...');
  };

  _click1 = e => {
    this.setState({
      items: Picker.normalizeItems(this.state.items2),
      value:2
    });
  };

  render() {
    const {items1, value1, items, value} = this.state;

    return (
      <div className="hello-picker">
        <button onClick={this._click1}>Update items</button>
        <div className="blank"></div>
        <Picker
          items={items}
          value={value}
          onChange={this.handleChange}/>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
