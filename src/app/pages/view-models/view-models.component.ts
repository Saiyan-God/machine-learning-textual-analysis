import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

}