import { Component, OnInit } from '@angular/core';
import * as AWS from 'aws-sdk';

require('../../../../node_modules/aws-sdk/clients/sagemaker')

@Component({
  selector: 'app-view-model',
  templateUrl: './view-models.component.html',
  styleUrls: ['./view-models.component.scss']
})

export class ViewModelsComponent implements OnInit {
	numTopics = 10;
	maxTermFreq = 0.50;
	minTermFreq = 0.10;
	items = [
	'doc 1',
	'doc 2',
	'doc 3',
	'doc 4',
	'doc 5',
	'doc 6',
	];
	private models = []
	private selectedModel = ""
	private sage:AWS.SageMaker;
  constructor() {
		AWS.config.update({
			accessKeyId: "",
			secretAccessKey: '',
			region: "us-east-2"
		});
		this.sage = new AWS.SageMaker();
		this.sage.listModels({}, (a, b) => { 
			console.log(a,b)
			this.models = b.Models;
			this.setModelAttributes(this.models[0]["ModelName"])
		})
	 }
	

	setModelAttributes(modelName){
		this.selectedModel = modelName
		if(this.selectedModel) {
			this.sage.describeModel({ModelName: this.selectedModel}, (a,b ) => {
				this.sage.describeTrainingJob({TrainingJobName: (b.PrimaryContainer || b.Containers[0]).ModelDataUrl.split("/")[5]}, (a,b) => console.log(a,b))
			})
		}	
	}

  ngOnInit() {

	}
	

	modelSelectChanged(e){
		this.setModelAttributes(e)
	}

}