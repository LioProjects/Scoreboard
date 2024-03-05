import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyballNormalComponent } from './moneyball-normal.component';

describe('MoneyballNormalComponent', () => {
  let component: MoneyballNormalComponent;
  let fixture: ComponentFixture<MoneyballNormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoneyballNormalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoneyballNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
