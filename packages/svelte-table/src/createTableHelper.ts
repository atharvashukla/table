import { constructTableHelper } from '@tanstack/table-core'
import { createTable } from './createTable.svelte'
import type {
  RowData,
  Table,
  TableFeatures,
  TableHelperOptions,
  TableHelper_Core,
  TableOptions,
} from '@tanstack/table-core'

export type TableHelper<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Omit<TableHelper_Core<TFeatures, TData>, 'tableCreator'> & {
  createTable: (
    tableOptions: Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels' | '_processingFns'
    >,
  ) => Table<TFeatures, TData>
}

export function createTableHelper<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  tableHelperOptions: TableHelperOptions<TFeatures, TData>,
): TableHelper<TFeatures, TData> {
  const tableHelper = constructTableHelper(createTable, tableHelperOptions)
  return {
    ...tableHelper,
    createTable: tableHelper.tableCreator,
  }
}

// test

// type Person = {
//   firstName: string
//   lastName: string
//   age: number
// }

// const tableHelper = createTableHelper({
//   _features: { rowSelectionFeature: {} },
//   TData: {} as Person,
// })

// const columns = tableHelper.columnHelper.columns([
//   tableHelper.columnHelper.accessor('firstName', { header: 'First Name' }),
//   tableHelper.columnHelper.accessor('lastName', { header: 'Last Name' }),
//   tableHelper.columnHelper.accessor('age', { header: 'Age' }),
//   tableHelper.columnHelper.display({ header: 'Actions', id: 'actions' }),
// ])

// const data: Array<Person> = []

// tableHelper.createTable({
//   columns,
//   data,
// })
