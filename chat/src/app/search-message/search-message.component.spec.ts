import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMessageComponent } from './search-message.component';

describe('SearchMessageComponent', () => {
  let component: SearchMessageComponent;
  let fixture: ComponentFixture<SearchMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
