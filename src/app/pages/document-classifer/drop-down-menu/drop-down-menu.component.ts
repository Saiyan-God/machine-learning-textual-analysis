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

   
  }

  cleanURL(oldURL: string): SafeResourceUrl  {
    return this._sanitationService.bypassSecurityTrustResourceUrl(oldURL);
   }

  ngOnInit() {
     // var params = {
    //   Bucket: 'sagemaker-us-east-2-612969343006',
    //   Key: 'mykey.txt',
    //   Body: "HelloWorld"
    // };

    var s3 = new AWS.S3();
    
    // var params = {
    //   Bucket: "sagemaker-us-east-2-612969343006", 
    //   Key: "LDA_Visualization.html"
    //  };
    //  s3.getSignedUrl('getObject', params, (err, url) => {
    //   console.log('The URL is', url);
    //   this.ldaURL = url;
    //   });

    var params = {
      Bucket: "sagemaker-us-east-2-612969343006", 
      Key: "LDA_Visualization.html"
     };

    s3.getObject(params, function(err, data) {
       if (err) console.log(err, err.stack); // an error occurred
       else   {
        console.log(data);  
        var arr = data.Body.toString();
        //var byteArray = new Uint8Array(arr);
        document.getElementById("lda-iframe")["src"] = window.URL.createObjectURL(new Blob([arr], { type: 'text/html' }));
       }         // successful response
       /*
       data = {
        AcceptRanges: "bytes", 
        ContentLength: 3191, 
        ContentType: "image/jpeg", 
        ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
        LastModified: <Date Representation>, 
        Metadata: {
        }, 
        TagCount: 2, 
        VersionId: "null"
       }
       */
     });
  }

}
