import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewModelsComponent } from './view-models.component';
import { ThemeModule } from '../../@theme/theme.module';
import { NbCardModule } from '@nebular/theme';
import { NbListModule } from '@nebular/theme';
import { NbButtonModule } from '@nebular/theme';
import { NbInputModule } from '@nebular/theme';


@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    NbCardModule,
    NbListModule,
    NbButtonModule,
    NbInputModule,
  ],
  declarations: [ViewModelsComponent],
})
export class ViewModelsModule { }
