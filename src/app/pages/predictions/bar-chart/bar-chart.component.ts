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

            var colors = this.colorArrayGenerator(rows[0].length);
            var topValues = [];
            var runnerUps = []
    
            for (var i = 0; i < rows.length; i++) {
    
              var first = {name: "", value: 0,  itemStyle : { color: colors[0]}};
              var second = {name: "", value: 0, itemStyle : { color: colors[0]}};
    
              for (var j = 0; j < rows[i].length; j++) {
               
                var temp = {name: "Topic " + j, value: rows[i][j], itemStyle : { color: colors[j]}};
               
                if (temp.value > first.value) {
    
                  second.value = first.value;
                  second.itemStyle.color = first.itemStyle.color
                  second.name = first.name;
    
                  first.value = temp.value;
                  first.itemStyle.color = temp.itemStyle.color;
                  first.name = temp.name
    
                }else if (temp.value > second.value) {
    
                  second.value = temp.value;
                  second.itemStyle.color = temp.itemStyle.color;
                  second.name = temp.name;
    
                }
              }
              topValues.push(first);
              runnerUps.push(second);
            }
          
            var xAxisLabels = [];
            var topicLabels = [];
    
            for (var i = 0; i < topValues.length; i++) {
    
              xAxisLabels.push("Doc " + i);
    
              if (i < colors.length) {
                topicLabels.push({name:"Topic " + i});
              }
    
            }
            this.options = {
              title: {
                text: 'Top Two Topics Per Document',
              },
              legend: {
                show: true,
                data: ['black', 'white']
              },
              color: ['black', 'white'],
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow',
                },
              },
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
                },
              ],
              series: [
                {
                  type: 'bar',
                  data: topValues
                },
                { 
                  type: 'bar',
                  data: runnerUps
                }
              ],
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
