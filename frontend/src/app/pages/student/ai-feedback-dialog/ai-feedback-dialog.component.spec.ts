import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiFeedbackDialogComponent } from './ai-feedback-dialog.component';

describe('AiFeedbackDialogComponent', () => {
  let component: AiFeedbackDialogComponent;
  let fixture: ComponentFixture<AiFeedbackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiFeedbackDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiFeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
