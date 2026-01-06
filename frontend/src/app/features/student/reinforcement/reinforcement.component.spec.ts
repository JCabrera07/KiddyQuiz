import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinforcementComponent } from './reinforcement.component';

describe('ReinforcementComponent', () => {
  let component: ReinforcementComponent;
  let fixture: ComponentFixture<ReinforcementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReinforcementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReinforcementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
