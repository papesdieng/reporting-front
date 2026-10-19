import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TradeListComponent } from './trade-list';

describe('TradeListComponent', () => {
  let component: TradeListComponent;
  let fixture: ComponentFixture<TradeListComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TradeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => httpTestingController.verify());

  it('should create', () => {
    httpTestingController.expectOne('https://localhost:44389/api/trades').flush([]);

    expect(component).toBeTruthy();
  });

  it('should display trades when the request succeeds', async () => {
    httpTestingController.expectOne('https://localhost:44389/api/trades').flush([
      {
        id: 1,
        price: 100.25,
        currency: 'GBP',
        traderName: 'Judy',
        maturityDate: '2027-03-17T09:17:55.4063384'
      }
    ]);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Judy');
    expect(fixture.nativeElement.textContent).toContain('100.25');
  });

  it('should display an error when the request fails', async () => {
    httpTestingController.expectOne('https://localhost:44389/api/trades').flush(
      {},
      { status: 500, statusText: 'Server Error' }
    );
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent)
      .toContain('Error loading trades');
  });
});
