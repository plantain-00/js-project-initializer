/**
 * @public
 */
export type componentTypeNameData<T = any> = {
  component: string | Function;
  data: T;
}
