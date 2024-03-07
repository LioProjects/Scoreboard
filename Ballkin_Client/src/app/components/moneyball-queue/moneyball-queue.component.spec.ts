import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyballQueueComponent } from './moneyball-queue.component';

describe('MoneyballQueueComponent', () => {
  let component: MoneyballQueueComponent;
  let fixture: ComponentFixture<MoneyballQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoneyballQueueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoneyballQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
