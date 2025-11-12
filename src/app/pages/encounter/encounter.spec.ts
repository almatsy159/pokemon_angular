import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Encounter } from './encounter';

describe('Encounter', () => {
  let component: Encounter;
  let fixture: ComponentFixture<Encounter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Encounter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Encounter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
