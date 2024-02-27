import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreboardGraphComponent } from './scoreboard-graph.component';

describe('ScoreboardGraphComponent', () => {
  let component: ScoreboardGraphComponent;
  let fixture: ComponentFixture<ScoreboardGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreboardGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScoreboardGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
