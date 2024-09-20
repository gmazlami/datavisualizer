import { Component } from '@angular/core';
import { VisualizationComponent } from './visualization/visualization.component';
import { UploadComponent } from './upload/upload.component';
import { LoadDataComponent } from './load-data/load-data.component';
import { DataHistoryComponent } from './data-history/data-history.component';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [VisualizationComponent, UploadComponent, LoadDataComponent, DataHistoryComponent, RouterOutlet, RouterLink, RouterLinkActive]
})
export class AppComponent {
  title = 'Smart(-ish) Data Visualization';
}
