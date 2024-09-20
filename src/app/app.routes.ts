import { Route, RouterModule } from '@angular/router';
import { DataHistoryComponent } from './data-history/data-history.component'; // Adjust the path as necessary
import { AppComponent } from './app.component';
import { VisualizationComponent } from './visualization/visualization.component';

export const routes: Route[] = [
  { path: '', component: VisualizationComponent }, // Default route
  { path: 'data-history', component: DataHistoryComponent }, // Route to Data History
];

export const AppRoutingModule = RouterModule.forRoot(routes);