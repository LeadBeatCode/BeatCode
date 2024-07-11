import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMatchingLobbyComponent } from './game-matching-lobby.component';

describe('GameMatchingLobbyComponent', () => {
  let component: GameMatchingLobbyComponent;
  let fixture: ComponentFixture<GameMatchingLobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameMatchingLobbyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameMatchingLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
