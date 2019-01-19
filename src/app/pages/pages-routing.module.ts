import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DocumentClassifierComponent } from './document-classifer/document-classifier.component';
import { ViewModelsComponent } from './view-models/view-models.component';
import { ModelTrainerComponent } from './model-trainer/model-trainer.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
  {
      path: 'document-classifier',
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
    component: ModelTrainerComponent,
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
