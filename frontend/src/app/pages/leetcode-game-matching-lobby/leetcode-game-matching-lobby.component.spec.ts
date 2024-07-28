import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeetcodeGameMatchingLobbyComponent } from './leetcode-game-matching-lobby.component';

describe('LeetcodeGameMatchingLobbyComponent', () => {
  let component: LeetcodeGameMatchingLobbyComponent;
  let fixture: ComponentFixture<LeetcodeGameMatchingLobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeetcodeGameMatchingLobbyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeetcodeGameMatchingLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
