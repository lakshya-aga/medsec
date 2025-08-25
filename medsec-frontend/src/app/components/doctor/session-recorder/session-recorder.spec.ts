import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionRecorder } from './session-recorder';

describe('SessionRecorder', () => {
  let component: SessionRecorder;
  let fixture: ComponentFixture<SessionRecorder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionRecorder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionRecorder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
