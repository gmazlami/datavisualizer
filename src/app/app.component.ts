import { Component } from '@angular/core';
import { VisualizationComponent } from './visualization/visualization.component';
import { UploadComponent } from './upload/upload.component';
import { LoadDataComponent } from './load-data/load-data.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [VisualizationComponent, UploadComponent, LoadDataComponent]
})
export class AppComponent {
  title = 'Smart(-ish) Data Visualization';
}
