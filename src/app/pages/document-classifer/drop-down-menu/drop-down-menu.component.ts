import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

const URL = 'path_to_api';


import * as AWS from 'aws-sdk';

@Component({
  selector: 'ngx-drop-down-menu',
  templateUrl: './drop-down-menu.component.html',
  styleUrls: ['./drop-down-menu.component.scss'],
})
export class DropDownMenuComponent implements OnInit {
  ldaURL:any;

  public uploader: FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  constructor(public _sanitationService: DomSanitizer) { 

    // var params = {
    //   Bucket: 'sagemaker-us-east-2-612969343006',
    //   Key: 'mykey.txt',
    //   Body: "HelloWorld"
    // };

    var s3 = new AWS.S3();
    
    var params = {
      Bucket: "sagemaker-us-east-2-612969343006", 
      Key: "LDA_Visualization.html"
     };
     s3.getSignedUrl('getObject', params, (err, url) => {
      console.log('The URL is', url);
      this.ldaURL = url;
      });
  }

  cleanURL(oldURL: string): SafeResourceUrl  {
    return this._sanitationService.bypassSecurityTrustResourceUrl(oldURL);
   }

  ngOnInit() {
  }

}
