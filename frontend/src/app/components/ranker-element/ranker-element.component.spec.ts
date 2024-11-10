import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankerElementComponent } from './ranker-element.component';

describe('RankerElementComponent', () => {
  let component: RankerElementComponent;
  let fixture: ComponentFixture<RankerElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RankerElementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RankerElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
