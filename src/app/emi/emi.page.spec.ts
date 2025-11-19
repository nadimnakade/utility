import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmiPage } from './emi.page';

describe('EmiPage', () => {
  let component: EmiPage;
  let fixture: ComponentFixture<EmiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
