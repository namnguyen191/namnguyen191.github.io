import { createRef } from 'react';

import { Button } from './Button';

describe('Button types', () => {
  it('accepts its own props', () => {
    void (<Button variant="primary" size="sm" />);
  });

  it('rejects a size that does not exist', () => {
    // @ts-expect-error `xl` is not a size
    void (<Button size="xl" />);
  });

  it('rejects a variant that does not exist', () => {
    // @ts-expect-error `tertiary` is not a variant
    void (<Button variant="tertiary" />);
  });

  it('accepts native button props', () => {
    const ref = createRef<HTMLButtonElement>();
    void (
      <Button ref={ref} type="submit" id="test" name="test" aria-label="Button" data-cy="button" />
    );
  });

  it('rejects href', () => {
    // @ts-expect-error href is not accepted as a prop
    void (<Button href="my-link" />);
  });
});
