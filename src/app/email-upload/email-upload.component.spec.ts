import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailUploadComponent } from './email-upload.component';

describe('EmailUploadComponent', () => {
  let component: EmailUploadComponent;
  let fixture: ComponentFixture<EmailUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
