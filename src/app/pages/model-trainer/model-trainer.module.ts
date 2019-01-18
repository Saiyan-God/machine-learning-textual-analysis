import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelTrainerComponent } from './model-trainer.component';
import { ThemeModule } from '../../@theme/theme.module';
import { NbCardModule } from '@nebular/theme';
import { NbListModule } from '@nebular/theme';
import { NbButtonModule } from '@nebular/theme';
import { NbInputModule } from '@nebular/theme';
import { ToasterModule } from 'angular2-toaster';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    NbCardModule,
    NbListModule,
    NbButtonModule,
    NbInputModule,
    ToasterModule.forRoot()
  ],
  declarations: [ModelTrainerComponent],
})
export class ModelTrainerModule { }