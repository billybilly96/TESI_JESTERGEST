import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeClientsComponent } from './home-clients.component';

describe('HomeClientsComponent', () => {
  let component: HomeClientsComponent;
  let fixture: ComponentFixture<HomeClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
