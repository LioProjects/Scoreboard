import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsOverviewComponent } from './statistics-overview.component';

describe('StatisticsOverviewComponent', () => {
  let component: StatisticsOverviewComponent;
  let fixture: ComponentFixture<StatisticsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatisticsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
