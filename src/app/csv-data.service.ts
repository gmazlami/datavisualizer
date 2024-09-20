import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvDataService {

  private cache: Map<string, { headers: string[], data: any[] }> = new Map();

  addTableToCache(tableData: any[]): string {
    if (!tableData || !Array.isArray(tableData) || tableData.length === 0) {
      throw new TableDataError('Invalid table data: Must have at least one row.');
    }

    const headers = Object.keys(tableData[0]);
    if (headers.length === 0) {
      throw new TableDataError('Invalid table data: No headers found.');
    }

    const key = this.generateKey();
    this.cache.set(key, { headers, data: tableData });
    return key;
  }

  private generateKey(): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${random}`;
  }

  getCachedTable(key: string): any[] {
    const cachedTable = this.cache.get(key);
    if (!cachedTable) {
      throw new CacheNotFoundError(key);
    }
    return cachedTable.data;
  }

  getTableHeaders(key: string): string[] {
    const cachedTable = this.cache.get(key);
    if (!cachedTable) {
      throw new CacheNotFoundError(key);
    }
    return cachedTable.headers;
  }

  aggregateTableData(tableKey: string, groupByColumn: string, valueColumn: string): Map<string, { sum: number, count: number }> {
    const cachedTable = this.cache.get(tableKey);
    if (!cachedTable) {
      throw new CacheNotFoundError(tableKey);
    }

    const { data: tableData } = cachedTable;
    const aggregatedData = new Map<string, { sum: number, count: number }>();

    tableData.forEach(row => {
      let key = row[groupByColumn];
      let value = +row[valueColumn];
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

  getColumnStatistics(key: string, groupByColumn: string, column: string): { min: number, max: number, average: number, maxAverage: number } | null {
    const cachedTable = this.cache.get(key);
    if (!cachedTable) {
      throw new CacheNotFoundError(key);
    }

    const { data: tableData } = cachedTable;

    // First, get the raw values and calculate min, max, average
    const values = tableData.map(row => +row[column]).filter(val => !isNaN(val));
    if (values.length === 0) {
      throw new TableDataError(`No valid numeric data found in column: ${column}`);
    }

    const sum = values.reduce((acc, curr) => acc + curr, 0);
    const average = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Now, calculate max of the averages (sum / count for each grouped item)
    const aggregatedData = this.aggregateTableData(key, groupByColumn, column);
    const averageValues = Array.from(aggregatedData.values()).map(({ sum, count }) => count > 0 ? sum / count : 0);
    const maxAverage = Math.max(...averageValues);

    return { min, max, average, maxAverage };
  }
}

export class TableDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TableDataError';
  }
}

export class CacheNotFoundError extends Error {
  constructor(key: string) {
    super(`No cached table found for key: ${key}`);
    this.name = 'CacheNotFoundError';
  }
}
