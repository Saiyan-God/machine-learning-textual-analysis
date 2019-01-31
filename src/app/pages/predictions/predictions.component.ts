import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
require('../../../../node_modules/aws-sdk/clients/sagemaker');

@Component({
  selector: 'ngx-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionsComponent implements OnInit {

  public batchTransform;

  constructor(private router: Router) { 
    var urlArray = router.url.split('/');
    this.batchTransform = urlArray[urlArray.length - 1];
  }

  ngOnInit() {}

}
