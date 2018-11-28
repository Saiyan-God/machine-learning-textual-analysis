import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentClassifierComponent } from './document-classifier.component';
import { FileUploadModule } from 'ng2-file-upload';
import { DropDownMenuComponent } from './drop-down-menu/drop-down-menu.component';
import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    ThemeModule,
  ],
  declarations: [DocumentClassifierComponent, DropDownMenuComponent],
})
export class DocumentClassiferModule { }
