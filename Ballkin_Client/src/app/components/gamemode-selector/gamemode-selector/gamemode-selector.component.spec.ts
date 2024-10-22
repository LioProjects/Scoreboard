import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamemodeSelectorComponent } from './gamemode-selector.component';

describe('GamemodeSelectorComponent', () => {
  let component: GamemodeSelectorComponent;
  let fixture: ComponentFixture<GamemodeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamemodeSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamemodeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
