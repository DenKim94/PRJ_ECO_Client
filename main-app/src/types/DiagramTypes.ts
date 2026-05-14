export interface DiagramProps<T> {
  dataList: T[],
  title: string,
  widthPercent?: number,
  heightPx?: number,
  minHeightPx?: number,
  infoText?: string,
  xAxis: {
    dataKey: string;
    label?: string;
  },
  yAxis: {
    dataKey: string;
    label?: string;
    unit?: string;
  }
};
