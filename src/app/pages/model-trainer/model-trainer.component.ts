import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-model-trainer',
  templateUrl: './model-trainer.component.html',
  styleUrls: ['./model-trainer.component.scss']
})

export class ModelTrainerComponent implements OnInit {
	title = "Test";
	items = [
		'doc 1',
		'doc 2',
		'doc 3',
		'doc 4',
		'doc 5',
		'doc 6',
	];
	
  constructor() { }

  ngOnInit() {
  }

}