import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundIamgeComponent } from './background-iamge.component';

describe('BackgroundIamgeComponent', () => {
  let component: BackgroundIamgeComponent;
  let fixture: ComponentFixture<BackgroundIamgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundIamgeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BackgroundIamgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
