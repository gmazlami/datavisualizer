import { Component } from '@angular/core';
import { LoadDataComponent } from '../load-data/load-data.component';
import { UploadComponent } from '../upload/upload.component';

@Component({
  selector: 'app-data-history',
  standalone: true,
  imports: [LoadDataComponent, UploadComponent],
  templateUrl: './data-history.component.html',
  styleUrl: './data-history.component.css'
})
export class DataHistoryComponent {

}
