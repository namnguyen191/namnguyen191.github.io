import { renderToString } from 'react-dom/server';

import { Button } from './Button';

const LABEL = 'Save';

describe('Button', () => {
  it('renders without a browser, as on a server', () => {
    expect(renderToString(<Button>{LABEL}</Button>)).toBe(
      '<button type="button" class="nam-button nam-button--primary nam-button--md">Save</button>'
    );
  });
});
