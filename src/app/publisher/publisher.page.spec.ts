import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherPage } from './publisher.page';

describe('PublisherPage', () => {
  let component: PublisherPage;
  let fixture: ComponentFixture<PublisherPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublisherPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
