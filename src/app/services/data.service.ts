import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";

import fiveMinsMock from '../../assets/mocks/fiveMinsMock.json'
import thirtyMinsMock from '../../assets/mocks/thirtyMinsMock.json'
import hourlyMock from '../../assets/mocks/hourlyMock.json'

export interface ILogEntry {
  time: number;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() {
  }

  getFiveMinsData(): Observable<ILogEntry[]> {
    return of(fiveMinsMock);
  }

  getThirtyMinsData(): Observable<ILogEntry[]> {
    return of(thirtyMinsMock);
  }

  getHourlyData(): Observable<ILogEntry[]> {
    return of(hourlyMock);
  }

}
