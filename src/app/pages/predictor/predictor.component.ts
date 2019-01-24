import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableService } from '../../@core/data/smart-table.service';

import { NbWindowService } from '@nebular/theme';
import { WindowFormComponent } from './window-form/window-form.component';

import * as AWS from 'aws-sdk';

require('../../../../node_modules/aws-sdk/clients/sagemaker')

import {environment} from '../../../environments/environment'

@Component({
	selector: 'ngx-predictor',
	templateUrl: './predictor.component.html',
  styleUrls: ['./predictor.component.scss'],
  providers: [ToasterService]
})

export class PredictorComponent implements OnInit {
    config: ToasterConfig;

    position = 'toast-top-right';
    animationType = 'fade';
    title = 'HI there!';
    content = `I'm cool toaster!`;
    timeout = 5000;
    toastsLimit = 5;
    type = NbToastStatus.SUCCESS;

    isNewestOnTop = true;
    isHideOnClick = true;
    isDuplicatesPrevented = false;
    isCloseButton = true;


    private models = []
    private selectedModel = ""
    private hyperparameters = {};
    private sage: AWS.SageMaker;
    private s3: AWS.S3;
    private documents = []
    private model = { name: "", hyperparameters: {}, algorithmName: "" };
    private batchTransformJobs : AWS.SageMaker.TransformJobSummaries;
    private source = new Array();

    @ViewChild('contentTemplate') contentTemplate: TemplateRef<any>;
    @ViewChild('disabledEsc', { read: TemplateRef }) disabledEscTemplate: TemplateRef<HTMLElement>;

    constructor(private toasterService: ToasterService, private service: SmartTableService, private windowService: NbWindowService){
      this.source = new Array(this.service.getData()[0]);

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

      this.s3.listObjects({Bucket: "lda-sklearn", Prefix: "training-input/"}, (a,b) => {
        console.log(a,b)
        b.Contents.splice(0,1)
        this.documents = b.Contents
        this.documents = this.documents.map((a) => {
          a.Key = a.Key.split('/')[1]
          return a
        })
      })

      this.getTransformJobs()
    }

    getTransformJobs() {

      var param = {
        'NameContains': 'batch-transform-job'
      };
      this.sage.listTransformJobs(param, (a,b) => {
        this.batchTransformJobs = b.TransformJobSummaries
      })
    }

    ngOnInit(){

    }

    setModelAttributes(modelName) {
		this.selectedModel = modelName
		if (this.selectedModel) {
			this.sage.describeModel({ ModelName: this.selectedModel }, (a, b) => {
				this.sage.describeTrainingJob({ TrainingJobName: (b.PrimaryContainer || b.Containers[0]).ModelDataUrl.split("/")[4] }, (a, b) => {
          console.log(a, b);
          if(b){
            this.setHyperparameters(b.HyperParameters);
            this.setModelDisplay(b);
          }
				})
			})
		}
    }
    

  modelSelectChanged(e) {
		this.setModelAttributes(e)
  }

	setModelDisplay(b) {
		// var splitModelArtifacts = b.ModelArtifacts.S3ModelArtifacts.split("/")
		// var params = {
		// 	Bucket: splitModelArtifacts[2],
		// 	Key: splitModelArtifacts.slice(3, -1).join('/') + '/LDA_Visualization.html'
		// };

		// this.s3.getObject(params, function (err, data) {
		// 	if (err) console.log(err, err.stack); // an error occurred
		// 	else {
		// 		var arr = data.Body.toString();
		// 		document.getElementById("lda-iframe")["src"] = window.URL.createObjectURL(new Blob([arr], { type: 'text/html' }));
		// 	}         // successful response
		// });
	}

	setHyperparameters(b) {
		if(b["training_documents"]) {
			b["training_documents"] = JSON.parse(b["training_documents"].replace(/'/g, '"'))
		}
		this.hyperparameters = { ...b }
  }
  
  documentSelectChange(){
		console.log(this.documents)
		let checkedDocuments = this.documents.filter((d) => d.checked).map((d) => d.Key)
    this.model.hyperparameters["predict_documents"] = checkedDocuments
  }
  
  predict() {
    console.log(this.model, this.documents)
   
    let request = {
      job_name: `batch-transform-job-${this.selectedModel}-${Date.now()}`,
      predict_documents: this.model.hyperparameters['predict_documents']
    }
    let requestS3Key = `batch-transforms/${request.job_name}/request.json`
    this.s3.putObject({
      Bucket: environment.uploadBucket,
      Key: requestS3Key,
      Body: JSON.stringify(request),
      ContentType: "application/json"},
      (err,data) => this.createTransformJob(err, data, request, requestS3Key)
    );
  }

  createTransformJob(err, data, request, requestS3Key) {
    let predict: AWS.SageMaker.CreateTransformJobRequest = {} as AWS.SageMaker.CreateTransformJobRequest;
    console.log(JSON.stringify(err) + " " + JSON.stringify(data));
    predict.ModelName = this.selectedModel
    predict.TransformJobName =  request.job_name
    predict.TransformInput = {
      DataSource: {
        S3DataSource: {
          S3DataType: "S3Prefix",
          S3Uri: `s3://${environment.uploadBucket}/${requestS3Key}`
        }
      },
      ContentType: "text/json"
    }
    
    predict.TransformOutput = {
      S3OutputPath: `s3://${environment.uploadBucket}/batch-transforms/${request.job_name}`
    }
    
    predict.TransformResources = {
      InstanceCount: 1,
      InstanceType: "ml.m4.xlarge"
    }
    this.sage.createTransformJob(predict, (a,b) => { 
      this.showToast(this.type, "Batch Transform Job Created", `ARN: ${b.TransformJobArn}`)
      this.getTransformJobs()
      window.localStorage.setItem('batchTransformJobs', JSON.stringify({ jobs: this.batchTransformJobs}))
      console.log(a,b)
    })
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

  //window

  openWindow(contentTemplate) {
    this.windowService.open(
      contentTemplate,
      {
        title: 'Window content from template',
        context: {
          text: 'some text to pass into template',
        },
      },
    );
  }

  openWindowForm() {
    this.windowService.open(WindowFormComponent, { title: `Window` });
  }

  openWindowWithoutBackdrop() {
    this.windowService.open(
      this.disabledEscTemplate,
      {
        title: 'Window without backdrop',
        hasBackdrop: false,
        closeOnEsc: false,
      },
    );
  }
  

  //SMART TABLE

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false
      },
      firstName: {
        title: 'First Name',
        type: 'string',
      },
      lastName: {
        title: 'Last Name',
        type: 'string',
      },
      username: {
        title: 'Username',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      age: {
        title: 'Age',
        type: 'number',
      },
    },
  };

}