import { TextInput } from '@carbon/react';
import { useCallback, type ReactElement } from 'react';

export interface CustomInputProps {
  defaultValue?: string;
  onValueChange?: (newVal: string) => void;
}

export const CustomInput = (props: CustomInputProps): ReactElement => {
  const { defaultValue = '', onValueChange } = props;
  // oxlint-disable-next-line no-console
  console.log(`Nam data is: custom input re-render`);

  const onValChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(e.target.value);
    },
    [onValueChange]
  );

  return (
    <TextInput defaultValue={defaultValue} onChange={onValChange} id={''} labelText={undefined} />
  );
};
