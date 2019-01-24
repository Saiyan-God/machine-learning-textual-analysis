import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import * as AWS from 'aws-sdk';

require('../../../../node_modules/aws-sdk/clients/sagemaker')
import {environment} from '../../../environments/environment'
import * as csv from "csvtojson";

@Component({
  selector: 'ngx-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionsComponent implements OnInit {

  private sage: AWS.SageMaker;
  private s3: AWS.S3;
  private transformName;

  constructor(private route: ActivatedRoute) { 

    AWS.config.update({
      accessKeyId: environment.accessKeyId,
      secretAccessKey: environment.secretAccessKey,
      region: environment.region
    });

    console.log("the test", AWS.util.isNode());
    
    this.sage = new AWS.SageMaker();
    this.s3 = new AWS.S3();

    this.route.params.subscribe(params => {
      this.sage.listTransformJobs({NameContains: params["name"]}, (a,b) => {
        this.transformName = b.TransformJobSummaries[0].TransformJobName;
        console.log(this.transformName);
        console.log(a,b)
      })
    })
    
  }

  ngOnInit() {

    const params = {
      Bucket: 'lda-sklearn',
      Key: 'batch-transform-job-model-2-1548209529244/prediction-Articles.csv'
    };
    
    const stream = this.s3.getObject(params);
    
    let another = stream.createReadStream();


    //console.log("this is it", this.s3);
    var temp = this.s3;
    console.log(temp);

   // let stream = this.s3.getObject(params);
    //console.log(stream);
    // convert csv file (stream) to JSON format data
    //const json = csv().fromStream(stream);
    //console.log(json);
    
    /*
    async function csvToJSON() {
      // get csv file and create stream
      console.log("this is it", temp);
      temp.getObject(params).createReadStream();
      // convert csv file (stream) to JSON format data
      const json = await csv().fromStream(stream);
      console.log(json);
    };
    csvToJSON();


  /*  const param = {
      Bucket: "lda-sklearn",
      Prefix: "batch-transforms/" + "batch-transform-job-model-2-1548209529244"
    };
    this.s3.listObjects(param, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      }else {
        data.Contents.splice(0,1);
        var docs= data.Contents;
        docs = docs.map(function(a) {
          a.Key = a.Key.split('/')[2];
          return a;
        });
        console.log(docs);
      }
    });




    var params = {
      Bucket: "lda-sklearn", 
      Key: "batch-transforms/" + "batch-transform-job-model-2-1548209529244" + "/prediction-Articles.csv",
     };

     this.s3.getObject(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        console.log(data.ContentType);
        console.log("here");
      }       /*
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
       
     });*/
  }



}
