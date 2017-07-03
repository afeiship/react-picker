import Select from './main';
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
      items : ['Mr.', 'Mrs.', 'Ms.', 'Dr.','Mr1.', 'Mrs1.', 'Ms1.', 'Dr1.','Mr2.', 'Mrs2.', 'Ms2.', 'Dr2.'],
      name: 'title',
      value: 'Mr.'
    };
  }

  // Update the value in response to user picking event
  handleChange = (value) => {
    this.setState({value});
  };

  render() {
    const {items, name, value} = this.state;

    return (
      <Select
        items={items}
        name={name}
        value={value}
        onChange={this.handleChange}/>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
