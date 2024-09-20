import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppComponent } from './app.component';
import { UploadComponent } from './upload/upload.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { LoadDataComponent } from './load-data/load-data.component';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    VisualizationComponent,
    LoadDataComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
