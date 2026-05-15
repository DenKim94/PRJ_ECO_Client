export interface LineDiagramProps<T> {
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
    dataKey: string[];
    dataStyleProps?: dataStyleProps[];
    label?: string;
    unit?: string;
  }
};

interface dataStyleProps{
  legendName: string,
  color?: string
}

export interface BarDiagramProps<T> extends Omit<LineDiagramProps<T>, "yAxis"> {
  yAxis: {
    dataKey: string;
    label?: string;
    unit?: string;
  }
}