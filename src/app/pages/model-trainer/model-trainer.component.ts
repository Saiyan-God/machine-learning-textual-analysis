import { Component, OnInit } from '@angular/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';

import * as AWS from 'aws-sdk';

require('../../../../node_modules/aws-sdk/clients/sagemaker')

@Component({
	selector: 'app-model-trainer',
	templateUrl: './model-trainer.component.html',
	styleUrls: ['./model-trainer.component.scss']
})

export class ModelTrainerComponent implements OnInit {
	items = [
		'doc 1',
		'doc 2',
		'doc 3',
		'doc 4',
		'doc 5',
		'doc 6',
	];

	config: ToasterConfig;

	position = 'toast-top-right';
	animationType = 'fade';
	title = 'HI there!';
	content = `I'm cool toaster!`;
	timeout = 5000;
	toastsLimit = 5;
	type = 'default';

	isNewestOnTop = true;
	isHideOnClick = true;
	isDuplicatesPrevented = false;
	isCloseButton = true;


	private s3: AWS.S3;
	private sage: AWS.SageMaker;
	private traningJob: AWS.SageMaker.CreateTrainingJobRequest;
	private algorithms: Array<AWS.SageMaker.DescribeAlgorithmOutput>;
	private jobsInTraining;

	private model = { name: "", hyperparameters: {}, algorithmName: "" };

	constructor(private toasterService: ToasterService) {
		AWS.config.update({
			accessKeyId: "AKIAIJLLUPEITWHVD4DQ",
			secretAccessKey: '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',
			region: "us-east-2"
		});

		this.s3 = new AWS.S3();
		this.sage = new AWS.SageMaker();
		this.algorithms = []
		this.jobsInTraining = []
	}

	ngOnInit() {
		this.sage.listAlgorithms((a, b) => {
			console.log(a, b)
			b.AlgorithmSummaryList.forEach((a) => {
				this.sage.describeAlgorithm({ AlgorithmName: a.AlgorithmName }, (a, b) => {
					this.algorithms.push(b)
				})
				if (this.algorithms[0]) {
					this.model.algorithmName = this.algorithms[0].AlgorithmName
				}
			})
		})

		this.sage.listTrainingJobs({ StatusEquals: 'InProgress' }, (a, b) => {
			this.jobsInTraining = b.TrainingJobSummaries;
		})
		setInterval(() => { 
			let storedTraningJobs = JSON.parse(window.localStorage.getItem('jobsInTraining'))
			if (storedTraningJobs && storedTraningJobs["jobs"] && storedTraningJobs["jobs"].length != 0) {
				storedTraningJobs["jobs"] = storedTraningJobs["jobs"].filter((j, i) => {
					return this.sage.describeTrainingJob({ TrainingJobName: j["TrainingJobName"] }, (a, b) => {
						if (b.TrainingJobStatus == "Completed") {
							let modelInput: AWS.SageMaker.CreateModelInput = {} as AWS.SageMaker.CreateModelInput
							modelInput.ModelName = j["model"]["name"];
							modelInput.ExecutionRoleArn = b.RoleArn
							modelInput.Containers = [{
								ContainerHostname: 'Container1',
								ModelDataUrl: b.ModelArtifacts.S3ModelArtifacts,
								Image: "612969343006.dkr.ecr.us-east-2.amazonaws.com/lda-sklearn:latest"
							}]
							this.sage.createModel(modelInput, (a,b)=> {console.log(a,b)})
							console.log(modelInput)
							storedTraningJobs["jobs"] = storedTraningJobs["jobs"].splice(i, 1)
							return false
						}
						return true;
					})
				})
				window.localStorage.setItem('jobsInTraining', JSON.stringify(storedTraningJobs))
			}
		}, 3000)
	}

	createTrainingJob() {
		console.log(this.model);
		let trainingJob: AWS.SageMaker.CreateTrainingJobRequest = {} as AWS.SageMaker.CreateTrainingJobRequest;
		trainingJob.TrainingJobName = this.model.name + "-training-job-" + Date.now().toString()
		trainingJob.AlgorithmSpecification = {
			AlgorithmName: this.model.algorithmName,
			TrainingInputMode: "File"
		}
		trainingJob.EnableNetworkIsolation = false
		trainingJob.OutputDataConfig = {
			S3OutputPath: "s3://lda-sklearn/training-jobs"
		}
		trainingJob.ResourceConfig = {
			InstanceCount: 1,
			InstanceType: "ml.m4.xlarge",
			VolumeSizeInGB: 1
		}
		trainingJob.StoppingCondition = {
			MaxRuntimeInSeconds: 500
		}
		trainingJob.HyperParameters = this.model.hyperparameters
		trainingJob.InputDataConfig = [{
			ChannelName: 'training',
			DataSource: {
				S3DataSource: {
					S3DataType: "S3Prefix",
					S3Uri: "s3://sagemaker-us-east-2-612969343006/lda-sklearn/training-input",
				}
			}
		}]
		trainingJob.RoleArn = "arn:aws:iam::612969343006:role/service-role/AmazonSageMaker-ExecutionRole-20181201T132673"
		this.sage.createTrainingJob(trainingJob, (a, b) => {
			console.log(a, b)
			this.showToast(this.type, "Training Model Created", `ARN: ${b.TrainingJobArn}`)
			this.jobsInTraining.push({ TrainingJobName: trainingJob.TrainingJobName })
		})
		console.log(trainingJob)
		trainingJob["model"] = this.model
		window.localStorage.setItem('jobsInTraining', JSON.stringify({ jobs: new Array(trainingJob)}))
	}

	private showToast(type: string, title: string, body: string) {
		this.config = new ToasterConfig({
			positionClass: this.position,
			timeout: this.timeout,
			newestOnTop: this.isNewestOnTop,
			tapToDismiss: this.isHideOnClick,
			preventDuplicates: this.isDuplicatesPrevented,
			animation: this.animationType,
			limit: this.toastsLimit,
		});
		const toast: Toast = {
			type: type,
			title: title,
			body: body,
			timeout: this.timeout,
			showCloseButton: this.isCloseButton,
			bodyOutputType: BodyOutputType.TrustedHtml,
		};
		this.toasterService.popAsync(toast);
	}


}