import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VisualizationComponent } from '../visualization/visualization.component';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.css'],
  standalone: true,
  imports: [VisualizationComponent, NgFor, CommonModule]
})
export class LoadDataComponent implements OnInit {
  files: string[] = [];
  data: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<string[]>('/api/load-files').subscribe(files => {
      this.files = files;
    });
  }

  loadData(filename: string) {
    this.http.get<any[]>(`/api/visualize/${filename}`).subscribe(data => {
      this.data = data;
    });
  }
}
