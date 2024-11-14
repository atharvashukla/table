import { describe, expect, it } from 'vitest'
import {
  ColumnDef,
  createColumnHelper,
  constructTable,
  createCoreRowModel,
  createPaginatedRowModel,
  rowPinningFeature,
  rowPaginationFeature,
} from '../src'
import { makeData, Person } from './makeTestData'

type personKeys = keyof Person
type PersonColumn = ColumnDef<
  any,
  Person,
  string | number | Person[] | undefined
>

function generateColumns(people: Person[]): PersonColumn[] {
  const columnHelper = createColumnHelper<any, Person>()
  const person = people[0]
  return Object.keys(person).map((key) => {
    const typedKey = key as personKeys
    return columnHelper.accessor(typedKey, { id: typedKey })
  })
}

describe('rowPinningFeature', () => {
  describe('constructTable', () => {
    describe('getTopRows', () => {
      it('should return pinned rows when keepPinnedRows is true rows are visible', () => {
        const data = makeData(10)
        const columns = generateColumns(data)

        const table = constructTable<any, Person>({
          _features: { rowPinningFeature, rowPaginationFeature },
          _rowModels: {
            paginatedRowModel: createPaginatedRowModel(),
          },
          enableRowPinning: true,
          keepPinnedRows: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          state: {
            pagination: {
              pageSize: 5,
              pageIndex: 0, //pinned rows will be on page 0
            },
            rowPinning: {
              bottom: [],
              top: ['0', '1'],
            },
          },
          columns,
        })

        const result = table.getTopRows()

        expect(result.length).toBe(2)
        expect(result[0].id).toBe('0')
        expect(result[1].id).toBe('1')
      })
      it('should return pinned rows when keepPinnedRows is true rows are not visible', () => {
        const data = makeData(10)
        const columns = generateColumns(data)

        const table = constructTable<any, Person>({
          _features: { rowPinningFeature, rowPaginationFeature },
          _rowModels: {
            paginatedRowModel: createPaginatedRowModel(),
          },
          enableRowPinning: true,
          keepPinnedRows: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          state: {
            pagination: {
              pageSize: 5,
              pageIndex: 1, //pinned rows will be on page 0
            },
            rowPinning: {
              bottom: [],
              top: ['0', '1'],
            },
          },
          columns,
        })

        const result = table.getTopRows()

        expect(result.length).toBe(2)
        expect(result[0].id).toBe('0')
        expect(result[1].id).toBe('1')
      })
      it('should return pinned rows when keepPinnedRows is false rows are visible', () => {
        const data = makeData(10)
        const columns = generateColumns(data)

        const table = constructTable<any, Person>({
          _features: { rowPinningFeature, rowPaginationFeature },
          _rowModels: {
            paginatedRowModel: createPaginatedRowModel(),
          },
          enableRowPinning: true,
          keepPinnedRows: false,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          state: {
            pagination: {
              pageSize: 5,
              pageIndex: 0, //pinned rows will be on page 0
            },
            rowPinning: {
              bottom: [],
              top: ['0', '1'],
            },
          },
          columns,
        })

        const result = table.getTopRows()

        expect(result.length).toBe(2)
        expect(result[0].id).toBe('0')
        expect(result[1].id).toBe('1')
      })
      it('should not return pinned rows when keepPinnedRows is false and rows are not visible', () => {
        const data = makeData(10)
        const columns = generateColumns(data)

        const table = constructTable<any, Person>({
          _features: { rowPinningFeature, rowPaginationFeature },
          _rowModels: {
            paginatedRowModel: createPaginatedRowModel(),
          },
          enableRowPinning: true,
          keepPinnedRows: false,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          state: {
            pagination: {
              pageSize: 5,
              pageIndex: 1, //pinned rows will be on page 0, but this is page 1
            },
            rowPinning: {
              bottom: [],
              top: ['0', '1'],
            },
          },
          columns,
        })

        const result = table.getTopRows()

        expect(result.length).toBe(0)
      })

      it('should return correct top rows', () => {
        const data = makeData(10)
        const columns = generateColumns(data)

        const table = constructTable<any, Person>({
          _features: { rowPinningFeature, rowPaginationFeature },
          _rowModels: {
            paginatedRowModel: createPaginatedRowModel(),
          },
          enableRowPinning: true,
          keepPinnedRows: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          state: {
            pagination: {
              pageSize: 5,
              pageIndex: 0, //pinned rows will be on page 0
            },
            rowPinning: {
              bottom: [],
              top: ['1', '3'],
            },
          },
          columns,
        })

        const result = table.getTopRows()

        expect(result.length).toBe(2)
        expect(result[0].id).toBe('1')
        expect(result[1].id).toBe('3')
      })
      it('should return correct bottom rows', () => {
        const data = makeData(10)
        const columns = generateColumns(data)

        const table = constructTable<any, Person>({
          _features: { rowPinningFeature, rowPaginationFeature },
          _rowModels: {
            paginatedRowModel: createPaginatedRowModel(),
          },
          enableRowPinning: true,
          keepPinnedRows: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          state: {
            pagination: {
              pageSize: 5,
              pageIndex: 0, //pinned rows will be on page 0
            },
            rowPinning: {
              bottom: ['1', '3'],
              top: [],
            },
          },
          columns,
        })

        const result = table.getBottomRows()

        expect(result.length).toBe(2)
        expect(result[0].id).toBe('1')
        expect(result[1].id).toBe('3')
      })
    })
    describe('getCenterRows', () => {
      it('should return all rows except any pinned rows', () => {
        const data = makeData(6)
        const columns = generateColumns(data)

        const table = constructTable<any, Person>({
          _features: { rowPinningFeature, rowPaginationFeature },
          _rowModels: {
            paginatedRowModel: createPaginatedRowModel(),
          },
          enableRowPinning: true,
          keepPinnedRows: true,
          onStateChange() {},
          renderFallbackValue: '',
          data,
          state: {
            pagination: {
              pageSize: 10,
              pageIndex: 0,
            },
            rowPinning: {
              top: ['1', '3'],
              bottom: ['2', '4'],
            },
          },
          columns,
        })

        const result = table.getCenterRows()

        expect(result.length).toBe(2)
        expect(result[0].id).toBe('0') // 0 and 5 are the only rows not pinned
        expect(result[1].id).toBe('5')
      })
    })
  })
})
