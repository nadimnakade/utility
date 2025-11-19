import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanycategoryPage } from './companycategory.page';

describe('CompanycategoryPage', () => {
  let component: CompanycategoryPage;
  let fixture: ComponentFixture<CompanycategoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanycategoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanycategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
