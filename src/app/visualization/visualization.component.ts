import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DataService } from '../data.service';  // Assume this downloads data from somewhere
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { CsvDataService, TableDataError, CacheNotFoundError } from '../csv-data.service'; // Our enhanced data service

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css'],
  standalone: true,
  imports: [NgxChartsModule, FormsModule]
})
export class VisualizationComponent implements OnChanges, OnInit {
  @Input() fileName: string = ''; // File to load
  chartData: any[] = [];
  colorScheme = 'cool'; // Color scheme for the chart
  downloadedFileContent: any = {}; // Content of the file
  yAxisLabel = 'Value'; // Default labels for axes
  xAxisLabel = 'Category';
  yScaleMin: number = 0; // Default scale for the Y-axis
  yScaleMax: number = 0;
  tableKey: string | null = null; // Key to refer to the cached table
  headers: string[] = []; // Store table headers for user selection
  selectedXAxis: string = ''; // User-selected X-axis
  selectedYAxis: string = ''; // User-selected Y-axis
  errorMessage: string = ''; // Store error messages for the user

  constructor(private dataService: DataService, private csvDataService: CsvDataService) { }

  ngOnInit() {
    console.log("Visualization initialized");
    this.errorMessage = '';
    if (this.fileName) {
      this.loadFile(this.fileName);
    }
  }

  ngOnChanges() {
    console.log("Visualization updated");
    if (this.fileName) {
      this.loadFile(this.fileName);
    }
  }

  // Load the file and handle CSV parsing and caching
  loadFile(fileName: string) {
    this.errorMessage = ''; // Clear previous errors
    this.dataService.downloadFile(fileName).subscribe({
      next: (content) => {
        try {
          this.downloadedFileContent = content.data;
          const { headers, tableData } = this.parseCSV(content.data);
          this.tableKey = this.csvDataService.addTableToCache(tableData);
          if (!this.tableKey) {
            throw new TableDataError('Failed to add table to cache');
          }
          this.headers = this.csvDataService.getTableHeaders(this.tableKey) || [];
        } catch (error) {
          this.handleError(error);
        }
      },
      error: (err) => {
        this.errorMessage = 'Error downloading file: ' + err.message;
      }
    });
  }

  // Simple CSV parser function
  parseCSV(csvData: string): { headers: string[], tableData: any[] } {
    const rows = csvData.split('\n');
    const headers = rows[0].split(';');
    const tableData = rows.slice(1).map(row => {
      const values = row.split(';');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {} as { [key: string]: string });
    });
    return { headers, tableData };
  }

  onHeaderSelect() {
    if (!this.tableKey || !this.selectedXAxis || !this.selectedYAxis) {
      this.errorMessage = 'Please select both X and Y axis headers.';
      return;
    }
    try {
      const stats = this.csvDataService.getColumnStatistics(this.tableKey, this.selectedXAxis, this.selectedYAxis);
      const aggregatedData = this.csvDataService.aggregateTableData(this.tableKey, this.selectedXAxis, this.selectedYAxis);

      if (stats && aggregatedData) {  // Null check for stats and aggregatedData
        // Construct chart data using aggregated averages
        this.chartData = Array.from(aggregatedData, ([name, { sum, count }]) => ({
          name,
          value: count > 0 ? sum / count : 0
        }));

        // Set yScaleMin and yScaleMax using the min and maxAverage from the statistics
        this.yScaleMin = stats.min;
        console.log(stats.max);
        console.log(stats.maxAverage);
        this.yScaleMax = stats.maxAverage;

        this.errorMessage = ''; // Clear any previous errors
      } else {
        this.errorMessage = 'Error calculating statistics or aggregating data.';
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  // Centralized error handling function
  handleError(error: any) {
    if (error instanceof TableDataError || error instanceof CacheNotFoundError) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = 'Unexpected error occurred: ' + error;
    }
  }
}
