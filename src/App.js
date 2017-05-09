import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Rx from 'rxjs';

import {receiveGreeting} from './redux-things';
import {apiIncrementalGreeting} from './api';

// http://stackoverflow.com/questions/37316156/how-to-debounce-user-input-in-reactjs-using-rxjs

class App extends Component {
  constructor(props) {
    super(props);
    this.handleClickMe = this.handleClickMe.bind(this);

    this.rxSubject = new Rx.Subject()
      .debounceTime(1000)
      .scan(acc => ++acc, 0)
      .switchMap(params =>
        apiIncrementalGreeting(params)
          .map(res => res.greeting)
      );

    this.rxSubject.subscribe(greeting => {
      this.props.receiveGreeting(greeting);
    });
  }

  render() {
    return (
      <div className="container">
        <div className="jumbotron">
          <h3>{this.props.greeting}</h3>
          <button onClick={this.handleClickMe}>Generate super greeting</button>
          <button>Cancel it!</button>
        </div>
      </div>
    );
  }

  handleClickMe(e) {
    console.log('handleClickMe');
    this.rxSubject.next(e);
  }
}

App.propTypes = {
  greeting: React.PropTypes.string,
  receiveGreeting: React.PropTypes.func,
};

export default connect(
  state => ({greeting: state.greeting}),
  dispatch => (bindActionCreators({receiveGreeting}, dispatch))
)(App);
