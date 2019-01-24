import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import * as AWS from 'aws-sdk';

require('../../../../../node_modules/aws-sdk/clients/sagemaker')

const allowedUploadTypes = ['application/pdf', 'text/plain'];

@Component({
  selector: 'ngx-drop-down-menu',
  templateUrl: './drop-down-menu.component.html',
  styleUrls: ['./drop-down-menu.component.scss'],
})
export class DropDownMenuComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({
    disableMultipart: true,
    allowedMimeType: allowedUploadTypes
  });
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  private uploadFolderContents  = [];
  private checkedDocs = [];

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  constructor(public _sanitationService: DomSanitizer) { 

  }

  ngOnInit() {

		AWS.config.update({
			accessKeyId: environment.accessKeyId,
      secretAccessKey: environment.secretAccessKey,
			region: environment.region
		});

    var s3 = new AWS.S3();
    
    this.listDocs(s3);

    this.uploader.onAfterAddingFile = function(item) {
      const param = {
        Bucket: environment.uploadBucket,
        Key: environment.uploadFolder + item._file.name
      };
      s3.getSignedUrl('putObject', param, function (err, url) {
            if (err) {
              console.log(err, err.stack);
            }else {
              item.url = url;
              item.method = "PUT";
              item.withCredentials = false;
            }
      });
    }

    this.uploader.onWhenAddingFileFailed = function(item) {
      if (!allowedUploadTypes.includes(item.type)) {
        alert('Invalid file format, must be a pdf or text file');
      }
    }
  }
  
  selectAll() {
    for(var i = 0; i < this.uploadFolderContents.length; i++) {
      this.uploadFolderContents[i].checked = true;
    }
  }
  
	documentSelectChange(){
    this.checkedDocs = this.uploadFolderContents.filter((d) => d.checked).map((d) => d.Key);
	}

  removeSelected() {
    
    var s3 = new AWS.S3();
    var keys = [];
    for (var i = 0; i < this.checkedDocs.length; i++) {
      keys.push( {Key: environment.uploadFolder + this.checkedDocs[i]});
    }
    var params = {
      Bucket: environment.uploadBucket, 
      Delete: {
       Objects: keys, 
       Quiet: false
      }
     };
     s3.deleteObjects(params, function(err, data) {
       if (err) console.log(err, err.stack); // an error occurred
     });

     //this.listDocs(s3);
  }

  listDocs(s3) {
    const param = {
      Bucket: environment.uploadBucket,
      Prefix: environment.uploadFolder
    };
    s3.listObjects(param, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      }else {
        data.Contents.splice(0,1);
        this.uploadFolderContents = data.Contents;
        this.uploadFolderContents.map(function(a) {
          a.Key = a.Key.split('/')[1];
          return a;
        });
      }
    });
  }
}
