import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

const URL = 'temp';

@Component({
  selector: 'ngx-document-classifier',
  templateUrl: './document-classifier.component.html',
  styleUrls: ['./document-classifier.component.scss'],
})

export class DocumentClassifierComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({url: URL});

  constructor() { }

  ngOnInit() {


  }

}
