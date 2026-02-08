export class GetAllResponse<T = any> {
  result: {
    docCount?: number;
    limit?: number;
    pages?: number;
    currentPage?: number | undefined;
    result?: T[];
  };
}
