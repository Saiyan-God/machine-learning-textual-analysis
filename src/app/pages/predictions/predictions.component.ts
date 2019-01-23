import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import * as AWS from 'aws-sdk';

require('../../../../node_modules/aws-sdk/clients/sagemaker')
import {environment} from '../../../environments/environment'

@Component({
  selector: 'ngx-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionsComponent implements OnInit {

  private sage: AWS.SageMaker;
  private s3: AWS.S3;

  constructor(private route: ActivatedRoute) { 

    AWS.config.update({
      accessKeyId: environment.accessKeyId,
      secretAccessKey: environment.secretAccessKey,
      region: environment.region
    });
    
    this.sage = new AWS.SageMaker();
    this.s3 = new AWS.S3();

    this.route.params.subscribe(params => {
      this.sage.listTransformJobs({NameContains: params["name"]}, (a,b) => {
        console.log(a,b)
      })
    })
  }

  ngOnInit() {
  }

}
