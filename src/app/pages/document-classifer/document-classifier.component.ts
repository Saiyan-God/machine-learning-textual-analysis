import { Component, OnInit } from '@angular/core';

import * as AWS from 'aws-sdk';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'ngx-document-classifier',
  templateUrl: './document-classifier.component.html',
  styleUrls: ['./document-classifier.component.scss'],
})

export class DocumentClassifierComponent implements OnInit {
  private url:String;
  constructor() { }

  ngOnInit() {
    // var params = {
    //   Bucket: 'sagemaker-us-east-2-612969343006',
    //   Key: 'mykey.txt',
    //   Body: "HelloWorld"
    // };

		AWS.config.update({
			accessKeyId: environment.accessKeyId,
			secretAccessKey: environment.secretAccessKey,
			region: environment.region
		});

    var s3 = new AWS.S3();

    // s3.putObject(params, function (err, res) {
    //   if (err) {
    //       console.log("Error uploading data: ", err);
    //   } else {
    //       console.log("Successfully uploaded data to myBucket/myKey");
    //   }
    // });
//

    // var p2 = {
    //   Bucket:   'sagemaker-us-east-2-612969343006'  }

    // s3.listObjects(p2, function(err,data) {
    //   if (err) console.log(err, err.stack); // an error occurred
    //   else     console.log(data);           // successful response
    // })


    // var s3bucket = s3.listBuckets(function(err, data) {
    //   if (err) console.log(err, err.stack); // an error occurred
    //   else     console.log(data);           // successful response
    //   /*
    //   data = {
    //    Buckets: [
    //       {
    //      CreationDate: <Date Representation>, 
    //      Name: "examplebucket"
    //     }, 
    //       {
    //      CreationDate: <Date Representation>, 
    //      Name: "examplebucket2"
    //     }, 
    //       {
    //      CreationDate: <Date Representation>, 
    //      Name: "examplebucket3"
    //     }
    //    ], 
    //    Owner: {
    //     DisplayName: "own-display-name", 
    //     ID: "examplee7a2f25102679df27bb0ae12b3f85be6f290b936c4393484be31"
    //    }
    //   }
    //   */
    // });



    var params = {
      Bucket: "sagemaker-us-east-2-612969343006", 
      Key: "LDA_Visualization.html"
     };
    //  s3.getSignedUrl('getObject', params, function (err, url) {
    //   console.log('The URL is', url);
    //   });
    //  s3.getObject(params, function(err, data) {
    //    if (err) console.log(err, err.stack); // an error occurred
    //    else     console.log(data);           // successful response
    //    /*
    //    data = {
    //     AcceptRanges: "bytes", 
    //     ContentLength: 3191, 
    //     ContentType: "image/jpeg", 
    //     ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
    //     LastModified: <Date Representation>, 
    //     Metadata: {
    //     }, 
    //     TagCount: 2, 
    //     VersionId: "null"
    //    }
    //    */
    //  });
  }

}
