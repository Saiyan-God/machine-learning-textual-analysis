import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentClassifierComponent } from './document-classifier.component';
import { FileUploadModule } from 'ng2-file-upload';
import { DropDownMenuComponent } from './drop-down-menu/drop-down-menu.component';
import { ThemeModule } from '../../@theme/theme.module';
import { NbCardModule } from '@nebular/theme';
import { NbListModule } from '@nebular/theme';
import { NbButtonModule } from '@nebular/theme';
import { NbInputModule } from '@nebular/theme';
import { FilterPipe } from './drop-down-menu/drop-down-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    ThemeModule,
    NbCardModule,
    NbListModule,
    NbButtonModule,
    NbInputModule,
  ],
  declarations: [DocumentClassifierComponent, DropDownMenuComponent, FilterPipe],
})
export class DocumentClassiferModule { }
