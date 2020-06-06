import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorPage } from './director.page';

describe('DirectorPage', () => {
  let component: DirectorPage;
  let fixture: ComponentFixture<DirectorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
