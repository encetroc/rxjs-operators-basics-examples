import { fromEvent, interval,  of, range, timer } from 'rxjs'; 
import { concatMap, filter, map, mergeMap, mergeMapTo, pairwise,  reduce, scan,  startWith,    switchMap,  take, takeLast,  takeUntil,    takeWhile,    tap } from 'rxjs/operators';

import isOdd from './isOdd';

//tap
const btnStart_tap = document.getElementById('btnStart_tap')
const result_tap = document.getElementById('result_tap')

btnStart_tap.addEventListener('click', e => {
  e.target.disabled = true;

  timer(2000)
    .pipe(
      tap(console.log),
      tap({ complete: () => (e.target.disabled = false) })
    )
    .subscribe(item => {
      result_tap.textContent = 'done';
    });
})

//map
const canvas_map = document.getElementById('canvas_map')

fromEvent(canvas_map, 'mousemove')
  .pipe(
    map(e => ({
      x: e.offsetX,
      y: e.offsetY,
      ctx: e.target.getContext('2d')
    }))
  )
  .subscribe(pos => {
    pos.ctx.fillRect(pos.x, pos.y, 2, 2);
});

//filter
const btnStart_filter = document.getElementById('btnStart_filter')
const btnStop_filter = document.getElementById('btnStop_filter')
const result_filter = document.getElementById('result_filter')

btnStart_filter.addEventListener('click', () => {
  const sub =interval(500).pipe(
    filter(e => e%2 === 1)
  ).subscribe(e => result_filter.textContent = e.toString())

  btnStop_filter.addEventListener('click', () => sub.unsubscribe())
})

//take
const btnStart_take = document.getElementById('btnStart_take')
const result_take = document.getElementById('result_take')

btnStart_take.addEventListener('click', () => {
  interval(500).pipe(
    take(10),
    takeLast(5)
  )
  .subscribe({
    next: e => result_take.textContent = result_take.textContent + ' | ' + e,
    complete: () => result_take.textContent = result_take.textContent + ' | Completed'
  })
})

//takewhile
const btnStart_takewhile = document.getElementById('btnStart_takewhile')
const result_takewhile = document.getElementById('result_takewhile')

btnStart_takewhile.addEventListener('click', () => {
  interval(500).pipe(
    takeWhile(e => e < 6)
  )
  .subscribe({
    next: e => result_takewhile.textContent = result_takewhile.textContent + ' | ' + e,
    complete: () => result_takewhile.textContent = result_takewhile.textContent + ' | Completed'
  })
})

//takeuntil
const btnStart_takeuntil = document.getElementById('btnStart_takeuntil')
const btnStop_takeuntil = document.getElementById('btnStop_takeuntil')
const result_takeuntil = document.getElementById('result_takeuntil')

const stop$ = fromEvent(btnStop_takeuntil, 'click')

btnStart_takeuntil.addEventListener('click', () => {
  interval(500).pipe(
    takeUntil(stop$)
  ).subscribe(e => result_takeuntil.textContent = result_takeuntil.textContent + ' | ' + e)
})

//scan and reduce
const btnStart_scan = document.getElementById('btnStart_scan')
const result_scan = document.getElementById('result_scan')
const result_reduce = document.getElementById('result_reduce')

btnStart_scan.addEventListener('click', () => {
  interval(500).pipe(
    take(5),
    scan((previous, current) => previous + current, 0)
  ).subscribe(e => result_scan.textContent = result_scan.textContent + ' | ' + e)

  interval(500).pipe(
    take(5),
    reduce((previous, current) => previous + current, 0)
  ).subscribe(e => result_reduce.textContent = result_reduce.textContent + ' | ' + e)
})

//pairwise
const canvas_pairwise = document.getElementById('canvas_pairwise')

fromEvent(canvas_pairwise, 'mousemove')
  .pipe(
    map(e => ({
      x: e.offsetX,
      y: e.offsetY,
      ctx: e.target.getContext('2d')
    })),
    pairwise()
  )
  .subscribe(pair => {
    const [from, to] = pair
    const ctx = from.ctx

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
});

//mergemap, concatmap and switchmap
const btnStart_mergamap = document.getElementById('btnStart_mergamap')
const reset = document.getElementById('reset')
const result_mergemap = document.getElementById('result_mergemap')
const result_concatmap = document.getElementById('result_concatmap')
const result_switchmap = document.getElementById('result_switchmap')
const all_results = document.querySelectorAll('span')

reset.addEventListener('click', () => {
  all_results.forEach(e => e.textContent = '')
})

function createSecondObservable(click) {
  return interval(1000).pipe(
    map(i => `A ${click} B ${i}`),
    take(3)
  );
}

fromEvent(btnStart_mergamap, 'click')
  .pipe(
    scan(previous => previous + 1, 0),
    mergeMap(click => createSecondObservable(click)),
  )
  .subscribe({
    next: e => result_mergemap.textContent += ' | ' + e,
    complete: () => result_mergemap.textContent += + ' | Completed'
});

fromEvent(btnStart_mergamap, 'click')
  .pipe(
    scan(previous => previous + 1, 0),
    concatMap(click => createSecondObservable(click)),
  )
  .subscribe({
    next: e => result_concatmap.textContent += ' | ' + e,
    complete: () => result_concatmap.textContent += ' | Completed'
});

fromEvent(btnStart_mergamap, 'click')
  .pipe(
    scan(previous => previous + 1, 0),
    switchMap(click => createSecondObservable(click)),
  )
  .subscribe({
    next: e => result_switchmap.textContent += ' | ' + e,
    complete: () => result_switchmap.textContent += ' | Completed'
});

//startWith
const btnStart_startwith = document.getElementById('btnStart_startwith')
const result_startwith = document.getElementById('result_startwith')


btnStart_startwith.addEventListener('click', () => {
  interval(1000).pipe(
    take(5),
    startWith('hey')
  ).subscribe(e => result_startwith.textContent += ' | ' + e)
})

//custom operators
const btnStart_custom = document.getElementById('btnStart_custom')
const result_custom = document.getElementById('result_custom')

fromEvent(btnStart_custom, 'click').pipe
(
  mergeMapTo(range(0, 50)),
  isOdd(),
  tap(console.log)
).subscribe(e => (result_custom.textContent += ' | ' + e));