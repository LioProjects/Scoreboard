import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointValueSelectorComponent } from './point-value-selector.component';

describe('PointValueSelectorComponent', () => {
  let component: PointValueSelectorComponent;
  let fixture: ComponentFixture<PointValueSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointValueSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointValueSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
