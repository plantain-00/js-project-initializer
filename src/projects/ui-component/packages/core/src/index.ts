/**
 * @public
 */
export interface componentTypeNameData<T = any> {
  component: string | Function;
  data: T;
}
