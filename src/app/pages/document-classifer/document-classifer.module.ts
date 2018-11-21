import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentClassifierComponent } from './document-classifier.component';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
  ],
  declarations: [DocumentClassifierComponent],
})
export class DocumentClassiferModule { }
