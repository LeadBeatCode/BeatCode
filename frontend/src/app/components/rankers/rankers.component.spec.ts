import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankersComponent } from './rankers.component';

describe('RankersComponent', () => {
  let component: RankersComponent;
  let fixture: ComponentFixture<RankersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RankersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
