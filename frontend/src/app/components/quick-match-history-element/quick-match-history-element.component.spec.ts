import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickMatchHistoryElementComponent } from './quick-match-history-element.component';

describe('QuickMatchHistoryElementComponent', () => {
  let component: QuickMatchHistoryElementComponent;
  let fixture: ComponentFixture<QuickMatchHistoryElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickMatchHistoryElementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickMatchHistoryElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
