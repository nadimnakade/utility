import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpinwheelPage } from './spinwheel.page';

describe('SpinwheelPage', () => {
  let component: SpinwheelPage;
  let fixture: ComponentFixture<SpinwheelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinwheelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpinwheelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
