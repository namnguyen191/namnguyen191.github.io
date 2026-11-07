// oxlint-disable import/no-relative-parent-imports react/no-unstable-nested-components typescript/no-unnecessary-type-assertion typescript/no-unsafe-type-assertion
import { TextInput } from '@carbon/react/lib/components/TextInput';
import { useCallback, useMemo, useState, type ReactElement } from 'react';

import { CarbonTable } from '../../shared/components/carbon-table/CarbonTable';
import {
  createTableColumns,
  type TableModel,
} from '../../shared/components/carbon-table/CarbonTable.interface';
import {
  generateMockUserCreditCardData,
  type MockUserCreditCardData,
} from '../../shared/utils/mock-data';

import styles from './UserCreditTable.module.scss';

// oxlint-disable-next-line no-magic-numbers
const mockUserCreditCardData = generateMockUserCreditCardData(10);

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  dateStyle: 'full',
  timeStyle: 'long',
  timeZone: 'America/Toronto',
});
const formatISODate = (isoString: string): string => dateFormatter.format(new Date(isoString));

// Focuses the input as soon as it appears, which is when the user chose to edit the cell.
const focusOnMount = (input: HTMLInputElement | null): void => {
  input?.focus();
};

interface EditableCellProps<T extends number | string> {
  onFinishedEdit?: (val: T) => void;
  initialVal: T;
}
const EditableCell = <T extends number | string>(props: EditableCellProps<T>): ReactElement => {
  const { onFinishedEdit, initialVal } = props;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [val, setVal] = useState<T>(initialVal);
  const setNewVal = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const newVal = e.target.value;

      if (typeof initialVal === 'number') {
        setVal(Number.parseFloat(newVal) as T);
        return;
      }

      setVal(newVal as T);
    },
    [initialVal]
  );

  return (
    <div className={styles['editable-field']}>
      {isEditMode ? (
        <TextInput
          onBlur={() => {
            setIsEditMode(false);
            if (onFinishedEdit) {
              onFinishedEdit(val);
            }
          }}
          ref={focusOnMount}
          defaultValue={val}
          id=""
          labelText=""
          onChange={setNewVal}
        />
      ) : (
        <>
          <span
            aria-hidden="true"
            onClick={() => setIsEditMode(true)}
            className={styles['back-drop']}
          />
          <button type="button" onClick={() => setIsEditMode(true)} className={styles['read-mode']}>
            {val}
          </button>
        </>
      )}
    </div>
  );
};

export const UserCreditTable = (): ReactElement => {
  const [tableData, setTableData] = useState<MockUserCreditCardData[]>(mockUserCreditCardData);

  const updateDataCell = useCallback(
    <T extends keyof MockUserCreditCardData>(
      val: MockUserCreditCardData[T],
      rowIndex: number,
      colId: T
    ): void => {
      const existingVal = tableData[rowIndex]?.[colId];
      if (!existingVal || existingVal === val) {
        return;
      }

      setTableData((prev) =>
        prev.map((row, index) => {
          if (index !== rowIndex) {
            return row;
          }

          return {
            ...row,
            [colId]: val,
          };
        })
      );
    },
    [tableData]
  );

  const tableModel: TableModel<MockUserCreditCardData> = useMemo(
    () => ({
      columns: createTableColumns([
        {
          id: 'id',
          header: 'ID',
        },
        {
          id: 'firstName',
          header: 'First name',
        },
        {
          id: 'lastName',
          header: 'Last name',
        },
        {
          id: 'outstandingAmount',
          header: 'Outstanding amount',
          customCell: (val, rowIndex) =>
            EditableCell({
              initialVal: val,
              onFinishedEdit: (editedVal) =>
                updateDataCell(editedVal, rowIndex, 'outstandingAmount'),
            }),
        },
        {
          id: 'upCommingDueDate',
          header: 'Due date',
          resizeable: true,
          customCell: (val): ReactElement => {
            const dueDate = val as MockUserCreditCardData['upCommingDueDate'];
            return <>{formatISODate(dueDate)}</>;
          },
        },
        {
          id: 'mostRecentMissedPaymentDate',
          header: 'Recent missed payment',
          resizeable: true,
          customCell: (val): ReactElement => {
            const recentMissedPaymentDate =
              val as MockUserCreditCardData['mostRecentMissedPaymentDate'];
            return (
              <>{recentMissedPaymentDate ? formatISODate(recentMissedPaymentDate) : 'Never'}</>
            );
          },
        },
      ]),
    }),
    [updateDataCell]
  );

  return (
    <>
      <CarbonTable tableModel={tableModel} data={tableData} />
    </>
  );
};
