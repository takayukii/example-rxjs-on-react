import Rx from 'rxjs';

export function apiIncrementalGreeting(arg1) {
  console.log('apiIncrementalGreeting', arg1);
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({greeting: `Hello * ${arg1 * 100}`});
    }, 2000);
  });
  return Rx.Observable.fromPromise(p);
}
