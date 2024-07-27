import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchHistoryElementComponent } from './match-history-element.component';

describe('MatchHistoryElementComponent', () => {
  let component: MatchHistoryElementComponent;
  let fixture: ComponentFixture<MatchHistoryElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatchHistoryElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchHistoryElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
