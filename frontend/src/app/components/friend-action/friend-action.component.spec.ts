import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendActionComponent } from './friend-action.component';

describe('FriendActionComponent', () => {
  let component: FriendActionComponent;
  let fixture: ComponentFixture<FriendActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
