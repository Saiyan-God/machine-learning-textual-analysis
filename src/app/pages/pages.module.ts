import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DocumentClassiferModule } from './document-classifer/document-classifer.module';
import { ViewModelsModule } from './view-models/view-models.module';
import { ModelTrainerModule } from './model-trainer/model-trainer.module';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DocumentClassiferModule,
    ViewModelsModule,
    ModelTrainerModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
