import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticDetailComponent } from './statistic-detail.component';

describe('StatisticDetailComponent', () => {
  let component: StatisticDetailComponent;
  let fixture: ComponentFixture<StatisticDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatisticDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
