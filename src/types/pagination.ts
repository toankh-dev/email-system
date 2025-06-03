export interface IPaginationList<T> {
  data: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
}
