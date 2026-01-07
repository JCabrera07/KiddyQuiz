import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResfuerzoIAComponent } from './resfuerzo-ia.component';

describe('ResfuerzoIAComponent', () => {
  let component: ResfuerzoIAComponent;
  let fixture: ComponentFixture<ResfuerzoIAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResfuerzoIAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResfuerzoIAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
