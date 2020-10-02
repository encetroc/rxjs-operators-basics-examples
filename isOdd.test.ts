import { range } from 'rxjs';
import { reduce } from 'rxjs/operators';

import { marbles } from 'rxjs-marbles/jest';

import isOdd from './isOdd';

// unit test
test('A simple test', done => {
  range(1, 10)
    .pipe(
      isOdd(),
      reduce((p, c) => [...p, c], [])
    )
    .subscribe(primes => {
      expect(primes).toEqual([1, 3, 5, 7, 9]);
      done();
    });
});

// using marbles
test(
  'Primes to 10',
  marbles(context => {
    const numbers = context.cold('-1-2-3-4-5-6-7-8-9-|');
    const primes = '-1---3---5---7---9-|';

    const result = numbers.pipe(isOdd());

    context.expect(result).toBeObservable(primes);
  })
);

// using marbles
test(
  'Primes to 10 to 15',
  marbles(context => {
    const values = { a: 11, b: 12, c: 13, d: 14, e: 15 };
    const numbers = context.cold('-a-b-c-d-e-|', values);
    const primes = context.cold('-a---c---e-|', values);

    const result = numbers.pipe(isOdd());

    context.expect(result).toBeObservable(primes);
  })
);