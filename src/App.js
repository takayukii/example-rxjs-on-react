// http://stackoverflow.com/questions/37316156/how-to-debounce-user-input-in-reactjs-using-rxjs

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Rx from 'rxjs';

import {receiveGreeting} from './redux-things';
import {apiIncrementalGreeting} from './api';

let counter = 0;
class App extends Component {
  constructor(props) {
    super(props);
    this.handleGenerateGreeting = this.handleGenerateGreeting.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    this.cancelButtonClicks = Rx.Observable.fromEvent(document.getElementById('cancel-button'), 'click');
    this.rxSubject = new Rx.Subject()
      .debounceTime(1000)
      .switchMap(params =>
        apiIncrementalGreeting(params)
          .map(res => res.greeting)
          .do(this.props.receiveGreeting)
          .takeUntil(this.cancelButtonClicks)
      );

    this.rxSubject.subscribe(greeting => {
      console.log('subscribe', greeting);
    });
  }

  render() {
    return (
      <div className="container">
        <div className="jumbotron">
          <h3>{this.props.greeting}</h3>
          <button onClick={this.handleGenerateGreeting}>Generate super greeting</button>
          <button id="cancel-button" onClick={this.handleCancel}>Cancel it!</button>
        </div>
      </div>
    );
  }

  handleGenerateGreeting(e) {
    console.log('handleGenerateGreeting');
    this.rxSubject.next(++counter);
  }

  handleCancel(e) {
    console.log('handleCancel');
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
