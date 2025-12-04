import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailReportComponent } from './student-detail-report.component';

describe('StudentDetailReportComponent', () => {
  let component: StudentDetailReportComponent;
  let fixture: ComponentFixture<StudentDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDetailReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
