import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DocumentClassiferModule } from './document-classifer/document-classifer.module';
import { ViewModelsModule } from './view-models/view-models.module';
import { ModelTrainerModule } from './model-trainer/model-trainer.module';
import { PredictorModule } from './predictor/predictor.module';
import { PredictionsModule } from './predictions/predictions.module';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DocumentClassiferModule,
    ViewModelsModule,
    PredictorModule,
    ModelTrainerModule,
    PredictionsModule
  ],
  declarations: [
    ...PAGES_COMPONENTS
  ],
})
export class PagesModule {
}
