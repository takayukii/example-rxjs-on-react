// http://stackoverflow.com/questions/37316156/how-to-debounce-user-input-in-reactjs-using-rxjs
// http://stackoverflow.com/questions/29858674/rxjs-dynamically-add-events-from-another-eventemitter

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Rx from 'rxjs';

import {receiveGreeting} from './redux-things';
import {apiIncrementalGreeting} from './api';

import {EventEmitter} from 'events';
const emitter = new EventEmitter();

let counter = 0;
class App extends Component {
  constructor(props) {
    super(props);
    this.handleGenerateGreeting = this.handleGenerateGreeting.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.cancelEvents = Rx.Observable.create(observer => {
      const handler = d => {
        console.log('emmit', d);
        observer.next(d);
      };
      emitter.on('data', handler);
      return () => {
        console.log('disposed');
        emitter.removeListener('on', handler);
      };
    });
  }

  componentDidMount() {
    this.cancelButtonClicks = Rx.Observable.fromEvent(document.getElementById('cancel-button'), 'click');
    this.rxSubject = new Rx.Subject()
      .debounceTime(1000)
      .switchMap(params =>
        apiIncrementalGreeting(params)
          .map(res => res.greeting)
          .do(this.props.receiveGreeting)
          .takeUntil(this.cancelEvents)
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
    emitter.emit('data', 'cancel event');
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
