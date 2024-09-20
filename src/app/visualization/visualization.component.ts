import { Component, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DataService } from '../data.service';


@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css'],
  standalone: true,
  imports: [NgxChartsModule]
})
export class VisualizationComponent {
  @Input() fileName: string = '';
  chartData: any[] = [];
  colorScheme = 'cool';
  downloadedFileContent = {}

  constructor(private dataService: DataService) {}

  ngOnChanges() {
    console.log(this.fileName)

    this.dataService.downloadFile(this.fileName).subscribe({next: (content) => {
      console.log(content)
      this.downloadedFileContent = content.data; // Assign the returned content to the variable
      console.log('File content downloaded:', this.downloadedFileContent); // Optional: Log the content
    }})
  }

}
