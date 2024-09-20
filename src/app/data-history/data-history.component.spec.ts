import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataHistoryComponent } from './data-history.component';

describe('DataHistoryComponent', () => {
  let component: DataHistoryComponent;
  let fixture: ComponentFixture<DataHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
