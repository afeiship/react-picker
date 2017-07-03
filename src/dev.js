import Picker from './main';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ['Mr.', 'Mrs.', 'Ms.', 'Dr.','Mr1.', 'Mrs1.', 'Ms1.', 'Dr1.','Mr2.', 'Mrs2.', 'Ms2.', 'Dr2.'],
      name: 'title',
      value: 'Mr.'
    };
  }

  // Update the value in response to user picking event
  handleChange = (name,value) => {
    this.setState({name,value});
  };

  render() {
    const {items,name,value} = this.state;

    return (
      <Picker
        items={items}
        name={name}
        value={value}
        columnHeight={200}
        itemHeight={40}
        onChange={this.handleChange} />
    );
  }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
