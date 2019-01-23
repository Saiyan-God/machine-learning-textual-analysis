import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PredictionsComponent } from './predictions.component';
import { ThemeModule } from '../../@theme/theme.module';
import { NbCardModule } from '@nebular/theme';
import { NbListModule } from '@nebular/theme';
import { NbButtonModule } from '@nebular/theme';
import { NbInputModule } from '@nebular/theme';
import { ToasterModule } from 'angular2-toaster';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbDialogModule, NbWindowModule } from '@nebular/theme';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    NbCardModule,
    NbListModule,
    NbButtonModule,
    NbInputModule,
    Ng2SmartTableModule,
    ToasterModule.forRoot(),
    NbDialogModule.forChild(),
    NbWindowModule.forChild(),
  ],
  declarations: [PredictionsComponent],
})
export class PredictionsModule { }