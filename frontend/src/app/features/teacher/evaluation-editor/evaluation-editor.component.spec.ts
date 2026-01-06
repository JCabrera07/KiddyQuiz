import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationEditorComponent } from './evaluation-editor.component';

describe('EvaluationEditorComponent', () => {
  let component: EvaluationEditorComponent;
  let fixture: ComponentFixture<EvaluationEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
