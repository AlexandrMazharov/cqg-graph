import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgGraphComponent } from './svg-graph.component';

describe('SvgGraphComponent', () => {
  let component: SvgGraphComponent;
  let fixture: ComponentFixture<SvgGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
