import { merge, NEVER, Subject, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
const { logObject, buildUi } = require('./scripts/interface');

const extras = { 
  ' Info': {
    keys: ['i'],
    callback: () => {
      logObject(
        'App.ts include a continous running stream of bananas with a trigger for labour on work and off work.'
      );
    }
  },
};
const actions = [
  { 
    title: 'Throw in a banana on the band',
    callback: () => {
      manualBananas$.next();
    },
  },
  { 
    title: 'Start/Stop the banana band',
    callback: () => {
      bananaBandIsStopped = !bananaBandIsStopped;
    },
  },
];
buildUi({ actions, extras });

const manualBananas$ = new Subject<void>();
let numberOfBananas = 0;
let bananaBandIsStopped = false;
const frequency$ = timer(0, 3000);
const runningBand$ = frequency$.pipe(
  switchMap(() => bananaBandIsStopped ? NEVER : frequency$),
);
const bananas$ = merge(runningBand$, manualBananas$).pipe(
  map(() => numberOfBananas++),
);

bananas$.subscribe(res => logObject(res));

