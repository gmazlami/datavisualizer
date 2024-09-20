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
  yAxisLabel = 'Value';
  xAxisLabel = 'Year';
  yScaleMin: number = 0;
  yScaleMax: number = 0;

  constructor(private dataService: DataService) {}

  ngOnChanges() {
    console.log(this.fileName);

    this.dataService.downloadFile(this.fileName).subscribe({
      next: (content) => {
        console.log(content);
        this.downloadedFileContent = content.data;
        this.parseCSV(content.data);
        console.log('File content downloaded:', this.downloadedFileContent); // Optional: Log the content
      }
    });
  }

  parseCSV(csvData: string) {
    const rows = csvData.split('\n');
    const headers = rows[0].split(';');
    const tableData = rows.slice(1).map(row => {
      const values = row.split(';');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {} as { [key: string]: string });
    });

    // Assuming the first column is the x-axis and the last column is the y-axis
    const xAxisLabel = headers[1];
    const yAxisLabel = headers[headers.length - 1];
    this.xAxisLabel = xAxisLabel;
    this.yAxisLabel = yAxisLabel;

    const aggregatedData = this.aggregateData(tableData, xAxisLabel, yAxisLabel);
    const { yScaleMin, yScaleMax } = this.calculateAverages(aggregatedData);

    this.yScaleMin = yScaleMin;
    this.yScaleMax = yScaleMax;

    console.log('Aggregated Data:', aggregatedData);
    console.log('yScaleMin:', this.yScaleMin, 'yScaleMax:', this.yScaleMax);
  }

  private aggregateData(tableData: { [key: string]: string }[], xAxisLabel: string, yAxisLabel: string): Map<string, { sum: number, count: number }> {
    const aggregatedData = new Map<string, { sum: number, count: number }>();
    tableData.forEach(row => {
      let key = row[xAxisLabel];
      let value = +row[yAxisLabel];
      if (isNaN(value)) {
        value = 0;
      }
      if (!key) {
        key = 'Unknown';
      }
      if (aggregatedData.has(key)) {
        const data = aggregatedData.get(key)!;
        data.sum += value;
        data.count += 1;
      } else {
        aggregatedData.set(key, { sum: value, count: 1 });
      }
    });
    return aggregatedData;
  }

  private calculateAverages(aggregatedData: Map<string, { sum: number, count: number }>): { yScaleMin: number, yScaleMax: number } {
    // Calculate averages and transform aggregatedData into an array of objects for chartData
    this.chartData = Array.from(aggregatedData, ([name, { sum, count }]) => ({
      name,
      value: count > 0 ? sum / count : 0 // Ensure no division by zero
    }));

    // Calculate yScaleMin and yScaleMax
    const values = this.chartData.map(data => data.value);
    const yScaleMin = Math.min(...values);
    const yScaleMax = Math.max(...values);

    // Log chartData to verify its format
    console.log('Chart Data:', this.chartData);
    console.log('yScaleMin:', yScaleMin, 'yScaleMax:', yScaleMax);

    return { yScaleMin, yScaleMax };
  }
}