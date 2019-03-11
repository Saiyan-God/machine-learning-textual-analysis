import { Component, OnInit } from '@angular/core';
import * as AWS from 'aws-sdk';
import {environment} from '../../../environments/environment';

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
	private sage: AWS.SageMaker;
	private s3: AWS.S3;
	private hyperparameters = {};

	constructor() {
		AWS.config.update({
			accessKeyId: environment.accessKeyId,
			secretAccessKey: environment.secretAccessKey,
			region: environment.region
		});
		this.sage = new AWS.SageMaker();
		this.s3 = new AWS.S3();
		this.sage.listModels({}, (a, b) => {
			this.models = b.Models;
			this.setModelAttributes(this.models[0]["ModelName"])
		})
	}


	setModelAttributes(modelName) {
		this.selectedModel = modelName
		if (this.selectedModel) {
			this.sage.describeModel({ ModelName: this.selectedModel }, (a, b) => {
				this.sage.describeTrainingJob({ TrainingJobName: (b.PrimaryContainer || b.Containers[0]).ModelDataUrl.split("/")[4] }, (a, b) => {
					if(b){
						this.setHyperparameters(b.HyperParameters);
						this.setModelDisplay(b);
					}
				})
			})
		}
	}

	ngOnInit() {

	}


	modelSelectChanged(e) {
		this.setModelAttributes(e)
	}

	setModelDisplay(b) {
		var splitModelArtifacts = b.ModelArtifacts.S3ModelArtifacts.split("/")
		var params = {
			Bucket: splitModelArtifacts[2],
			Key: splitModelArtifacts.slice(3, -1).join('/') + '/LDA_Visualization.html'
		};

		this.s3.getObject(params, function (err, data) {
			if (err) console.log(err, err.stack, "Here"); // an error occurred
			else {
				var arr = data.Body.toString();
				document.getElementById("lda-iframe")["src"] = window.URL.createObjectURL(new Blob([arr], { type: 'text/html' }));
			}         // successful response
		});
	}

	setHyperparameters(b) {
		if(b["training_documents"]) {
			b["training_documents"] = JSON.parse(b["training_documents"].replace(/'/g, '"'))
		}
		this.hyperparameters = { ...b }
		var topics = []
		for (var index = 1; index <= b.num_of_topics; index ++) {
			topics.push("Topic " + index)
		}
		this.hyperparameters["topics"] = topics
	}

	saveTopics() {
		this.sage.describeModel({ ModelName: this.selectedModel }, (a, b) => {
			let name = (b.PrimaryContainer || b.Containers[0]).ModelDataUrl.split("/")[4]
			let request = {
				topics: this.hyperparameters.topics
			}
			let requestS3Key = `training-jobs/${name}/output/topics.json`
			let params = {
				Bucket: environment.uploadBucket,
				Key: requestS3Key,
				Body: JSON.stringify(request),
				ContentType: "application/json",
			}
			this.s3.putObject(params, function(err,data) {
				if (err) {
					console.log(err, err.stack)
					alert("Oops, failed to upload custom topic labels")
				}
			})
		})
	}

	customTrackBy(index: number, obj: any): any {
		return index;
	}

}
