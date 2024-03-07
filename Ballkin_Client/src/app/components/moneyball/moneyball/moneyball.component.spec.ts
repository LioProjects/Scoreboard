import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyballComponent } from './moneyball.component';

describe('MoneyballComponent', () => {
  let component: MoneyballComponent;
  let fixture: ComponentFixture<MoneyballComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoneyballComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoneyballComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
