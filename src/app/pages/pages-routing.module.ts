import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DocumentClassifierComponent } from './document-classifer/document-classifier.component';
import { ViewModelsComponent } from './view-models/view-models.component';
import { ModelTrainerComponent } from './model-trainer/model-trainer.component';
import { PredictorComponent } from './predictor/predictor.component';
import { PredictionsComponent } from './predictions/predictions.component'

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
  {
      path: 'datasets',
      component: DocumentClassifierComponent,
  },
  {
    path: 'view-models',
    component: ViewModelsComponent,
  }, {
    path: 'model-trainer',
    component: ModelTrainerComponent,
    pathMatch: 'full'
  }, {
    path: 'predict',
    component: PredictorComponent,
    pathMatch: 'full'
  }, 
  {
    path: 'predictions/:name',
    component: PredictionsComponent
  },
  {
    path: '**',
    component: DocumentClassifierComponent,
  }
],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
