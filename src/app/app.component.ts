import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {mergeMap} from "rxjs/operators";

import {DataService, ILogEntry} from "./services/data.service";

type TimeInterval = '5' | '30' | '60';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'time-intervals';
  selectedInterval$ = new BehaviorSubject<TimeInterval>('60');
  data = new Map;
  headerCols: any[] = [];

  constructor(private dataService: DataService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.watchIntervalChange();
  }

  private watchIntervalChange(): void {
    this.selectedInterval$
      .pipe(
        mergeMap(interval => this.getStreamByInterval(interval)))
      .subscribe({
        next: (value) => {
          this.fillData(value);
          this.cd.detectChanges();
        },
        error: err => {
          console.log(err);
        }
      });
  }

  fillData(array: ILogEntry[]): void {
    this.headerCols = [];
    this.data.clear();

    array.forEach(item => {
      const datetime = new Date(item.time * 1000).toLocaleString();
      this.headerCols.push(datetime);
      this.data.set(datetime, item.value);
    })
  }

  getStreamByInterval(interval: TimeInterval): Observable<ILogEntry[]> {
    switch (interval) {
      case "5":
        return this.dataService.getFiveMinsData()
      case "30":
        return this.dataService.getThirtyMinsData()
      case "60":
        return this.dataService.getHourlyData()
    }
  }

  changeInterval(value: TimeInterval): void {
    this.selectedInterval$.next(value);
  }
}
