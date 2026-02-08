export interface IResponse<T = any> {
  message?: string;
  status?: number;
  data?: T;
}
