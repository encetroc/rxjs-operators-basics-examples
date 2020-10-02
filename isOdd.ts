import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

// easiest way to create custom operators is to compbine default operators
// export default () => filter(number => number%2 === 1);

//a more complicated way for 100% custom operators
export default () => source =>
  Observable.create(observer => {
    source.subscribe(
      number => {
        if (number%2 === 1) {
          observer.next(number);
        }
      },
      err => observer.error(err),
      () => observer.complete()
    );
  });