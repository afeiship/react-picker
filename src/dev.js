import Picker from './main';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valueGroups: {
        title: 'Mr.',
      },
      optionGroups: {
        title: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'],
      }
    };
  }

  // Update the value in response to user picking event
  handleChange = (name, value) => {
    this.setState(({valueGroups}) => ({
      valueGroups: {
        ...valueGroups,
        [name]: value
      }
    }));
  };

  render() {
    const {optionGroups, valueGroups} = this.state;

    return (
      <Picker
        optionGroups={optionGroups}
        valueGroups={valueGroups}
        onChange={this.handleChange} />
    );
  }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
