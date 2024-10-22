import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSelectorNewComponent } from './player-selector-new.component';

describe('PlayerSelectorNewComponent', () => {
  let component: PlayerSelectorNewComponent;
  let fixture: ComponentFixture<PlayerSelectorNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerSelectorNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerSelectorNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
