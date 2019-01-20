import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import * as AWS from 'aws-sdk';

require('../../../../../node_modules/aws-sdk/clients/sagemaker')

@Component({
  selector: 'ngx-drop-down-menu',
  templateUrl: './drop-down-menu.component.html',
  styleUrls: ['./drop-down-menu.component.scss'],
})
export class DropDownMenuComponent implements OnInit {
  ldaURL:any;

  public uploader: FileUploader = new FileUploader({disableMultipart: true});
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public algorithms = [];

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  constructor(public _sanitationService: DomSanitizer) { 

  }

  cleanURL(oldURL: string): SafeResourceUrl  {
    return this._sanitationService.bypassSecurityTrustResourceUrl(oldURL);
   }

  ngOnInit() {

		AWS.config.update({
			accessKeyId: environment.accessKeyId,
      secretAccessKey: environment.secretAccessKey,
			region: environment.region
		});

    var s3 = new AWS.S3();
    var sage = new AWS.SageMaker();

    /*
    var params = {
      Bucket: 'sagemaker-us-east-2-612969343006', 
    };
    s3.listObjects(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    }); 
    */

    this.uploader.onAfterAddingFile= function(item) {
      const param = {
        Bucket: environment.uploadBucket,
        Key: item._file.name,
      };
      s3.getSignedUrl('putObject', param, function (err, url) {
            if (err) {
              console.log("The error is: " + err);
            }else {
              item.url = url;
              item.method = "PUT";
              item.withCredentials = false;
            }
      });
    }
  }
}
