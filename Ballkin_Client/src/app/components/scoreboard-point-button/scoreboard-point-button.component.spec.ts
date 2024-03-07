import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreboardPointButtonComponent } from './scoreboard-point-button.component';

describe('ScoreboardPointButtonComponent', () => {
  let component: ScoreboardPointButtonComponent;
  let fixture: ComponentFixture<ScoreboardPointButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreboardPointButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScoreboardPointButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
