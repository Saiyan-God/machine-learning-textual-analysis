import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import * as AWS from 'aws-sdk';
require('../../../../node_modules/aws-sdk/clients/sagemaker');
import {environment} from '../../../environments/environment';
const csv = require('csvtojson');

@Component({
  selector: 'ngx-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionsComponent implements OnInit {

  public batchTransform;

  constructor(private route: ActivatedRoute) { 
    this.batchTransform = route.url.value[1].path;
  }

  ngOnInit() {}

}
