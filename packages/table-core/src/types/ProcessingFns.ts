import type { TableFns_RowSorting } from '../features/row-sorting/rowSortingFeature.types'
import type { TableFns_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { RowData, UnionToIntersection } from './type-utils'
import type { TableFns_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { TableFeatures } from './TableFeatures'

export type ProcessingFns<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = {
  /**
   * @deprecated
   */
  _?: never
} & Partial<
  UnionToIntersection<
    | ('columnFilteringFeature' extends keyof TFeatures
        ? TableFns_ColumnFiltering<TFeatures, TData>
        : never)
    | ('columnGroupingFeature' extends keyof TFeatures
        ? TableFns_ColumnGrouping<TFeatures, TData>
        : never)
    | ('rowSortingFeature' extends keyof TFeatures
        ? TableFns_RowSorting<TFeatures, TData>
        : never)
  >
>

export type ProcessingFns_All<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Partial<
  TableFns_ColumnFiltering<TFeatures, TData> &
    TableFns_ColumnGrouping<TFeatures, TData> &
    TableFns_RowSorting<TFeatures, TData>
>
