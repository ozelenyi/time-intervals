import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from "rxjs";

import {AppComponent} from './app.component';
import {DataService} from "./services/data.service";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let dataService: DataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [DataService]
    }).compileComponents();

    const dataStream$ = of([{time: 0, value: 'hourly'}]);
    dataService = TestBed.get(DataService);
    spyOn(dataService, "getHourlyData").and.returnValue(dataStream$);

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'time-intervals'`, () => {
    expect(component.title).toEqual('time-intervals');
  });

  describe('template checks', () => {
    let compiled: HTMLElement;

    beforeEach(() => {
      compiled = fixture.nativeElement as HTMLElement;
    })

    it('should render select', () => {
      expect(compiled.querySelector('.select-interval')?.innerHTML).toContain('mat-select');
    });

    it('should render grid', () => {
      expect(compiled.querySelector('.grid')?.innerHTML.length).toBeGreaterThan(0);
    });

    it('should show "No data :(" when there is no data for the grid', () => {
      component.data.clear();
      fixture.componentInstance.cd.detectChanges(); // hack cuz with OnPush strategy smth goes wrong with fixture.detectChanges(), is just doesn't trigger rerender
      const element = fixture.nativeElement.querySelector('.content');

      expect(element.innerHTML).toContain('No data :(');
    });
  })

  it('should init time interval with "60"', () => {
    expect(component.selectedInterval$.value).toEqual('60');
  });

  describe('getStreamByInterval', () => {
    let service: DataService;

    beforeEach(() => {
      service = new DataService();
    });

    it('should return 5min data stream when "5" interval selected', () => {
      const stream = component.getStreamByInterval('5');
      expect(JSON.stringify(stream)).toEqual(JSON.stringify(service.getFiveMinsData()));
    });

    it('should return 30min data stream when "30" interval passed', () => {
      const stream = component.getStreamByInterval('30');
      expect(JSON.stringify(stream)).toEqual(JSON.stringify(service.getThirtyMinsData()));
    });

    it('should return 60min data stream when "60" interval passed', () => {
      const stream = component.getStreamByInterval('60');
      expect(JSON.stringify(stream)).toEqual(JSON.stringify(service.getHourlyData()));
    });

    it('should return empty array stream when wrong interval passed', () => {
      const stream = component.getStreamByInterval('60');
      expect(JSON.stringify(stream)).toEqual(JSON.stringify(of([])));
    });
  });

  describe('changeInterval', () => {
    it('should update selectedInterval$ value', () => {
      component.changeInterval('5');
      const interval = component.selectedInterval$.value;

      expect(interval).toEqual('5');
    });
  })

  describe('watchIntervalChange', () => {

    it('should call getStreamByInterval on change', function () {
      spyOn(component, 'getStreamByInterval');
      component.selectedInterval$.next('5');

      expect(component.getStreamByInterval).toHaveBeenCalledWith('5');
    });

    it('should call getHourlyData and write data to Map', async () => {
      expect(dataService.getHourlyData).toHaveBeenCalledWith();
      expect(component.data.size).toEqual(1);
    });
  });
});
