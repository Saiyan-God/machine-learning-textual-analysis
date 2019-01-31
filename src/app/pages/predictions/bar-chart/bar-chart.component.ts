import { Component, OnInit, Input } from '@angular/core';
import * as AWS from 'aws-sdk';
import {environment} from '../../../../environments/environment';
import { RouteConfigLoadStart } from '@angular/router';
require('../../../../../node_modules/aws-sdk/clients/sagemaker');
const csv = require('csvtojson');

@Component({
  selector: 'ngx-bar-chart',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class BarChartComponent implements OnInit {
  @Input() batchTransform;
  options;
  themeSubscription;

  constructor() {
    AWS.config.update({
      accessKeyId: environment.accessKeyId,
      secretAccessKey: environment.secretAccessKey,
      region: environment.region
    });
  }

  ngOnInit() {
   
    var s3 = new AWS.S3();

    var params = {
      Bucket: environment.batchTransformBucket,
      Key: environment.batchTransformsFolder + this.batchTransform + '/response.json'
    };  
    s3.getObject(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      }else {
        var response = JSON.parse(data.Body.toString());
        var fileName = response.predict_documents[0];

        params = {
          Bucket: environment.batchTransformBucket,
          Key: environment.batchTransformsFolder + this.batchTransform + '/prediction-' + fileName
        };  
        s3.getObject(params, (a,b) => {
          let body = b.Body.toString();
          csv({
            noheader:true,
            output: "csv"
          })
          .fromString(body)
          .then((rows)=>{
            rows.splice(0,1);
            console.log(rows);

            //Is there a better way to declare this?
            var seriesData = new Array(rows[0].length);
            for (var i = 0; i < seriesData.length; i++) {
              seriesData[i] = new Array();
            }

            
            //fill the dataSeries array. Each index of the 2D array corresponds to one topics data.
            for (var i = 0; i < rows.length; i++) {
              for (var a = 0; a < rows[i].length; a++) {
                seriesData[a].push(rows[i][a]);
              }
            }

            var seriesArray = [];
            for (var i = 0; i < seriesData.length; i++) {
              seriesArray.push(
                {
                  name: 'Topic ' + (i + 1),
                  type: 'bar',
                  stack: 'stack',
                  data: seriesData[i]
                }
              );
            }

            var xAxisLabels = []
            for (var i = 0; i < seriesData[0].length; i++) {
              xAxisLabels.push('Doc ' + (i + 1));
            }

            var legendLabels = [];
            for (var i = 0; i < seriesData.length; i++) {
              legendLabels.push('Topic ' + (i + 1));
            }

            //var colors = this.colorArrayGenerator(rows[0].length);

            this.options = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow',
                },
              },
              legend: {},
              xAxis: [
                {
                  name: "Documents",
                  type: 'category',
                  data: xAxisLabels,
                  axisLabel: {
                    textStyle: {
                      color: echarts.textColor,
                    },
                  },
                },
              ],
              yAxis: [
                {
                  type: 'value',
                  name: 'Topic Correlation',
                  max: 1
                },
              ],
              series: seriesArray
            };
          });
        });
      }
    });
  }


  colorArrayGenerator(length) {
    var colors = [];
    for (var i = 0; i < length; i++) {
      colors.push('#'+ Math.floor(Math.random()*16777215).toString(16));
    }
    return colors;
  }
}
