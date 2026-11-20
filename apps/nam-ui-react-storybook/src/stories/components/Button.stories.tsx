import { Button, type ButtonSize } from '@nam-ui/react/Button';
import { expect, fn } from 'storybook/test';

// oxlint-disable-next-line import/no-relative-parent-imports
import preview from '../../preview';

const DEFAULT_LABEL = 'Button';

const meta = preview.meta({
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: { children: DEFAULT_LABEL, onClick: fn() },
  // The props table lists nam-ui's own props, not native ones. The spy would add `onClick` to it.
  argTypes: { onClick: { table: { disable: true } } },
  tags: ['autodocs'],
});

export const Simple = meta.story();

const SIZE_LABELS = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
} satisfies Record<ButtonSize, string>;

export const Sizes = meta.story({
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button {...args} size="sm">
        {SIZE_LABELS.sm}
      </Button>
      <Button {...args} size="md">
        {SIZE_LABELS.md}
      </Button>
      <Button {...args} size="lg">
        {SIZE_LABELS.lg}
      </Button>
    </div>
  ),
});

export const Disabled = meta.story({
  args: { disabled: true },
});

export const Hover = meta.story({ tags: ['test-only'], globals: { pseudo: { hover: true } } });
export const Focus = meta.story({
  tags: ['test-only'],
  globals: { pseudo: { focusVisible: true } },
});
export const Active = meta.story({ tags: ['test-only'], globals: { pseudo: { active: true } } });

export const LongLabel = meta.story({
  args: { children: 'This is a really long label' },
  render: (args) => (
    <div style={{ width: '10rem' }}>
      <Button {...args} />
    </div>
  ),
});

const DEFAULT_CLASSES = ['nam-button', 'nam-button--primary', 'nam-button--md'];
Simple.test('is visible and has the default classes', async ({ canvas }) => {
  const button = canvas.getByRole('button', { name: DEFAULT_LABEL });
  await expect(button).toBeVisible();
  await expect(button).toHaveClass(...DEFAULT_CLASSES);
  await expect(button).not.toHaveClass('undefined');
});

Simple.test('type is button by default', async ({ canvas }) => {
  await expect(canvas.getByRole('button', { name: DEFAULT_LABEL })).toHaveAttribute(
    'type',
    'button'
  );
});

Simple.test('type can be overridden', { args: { type: 'reset' } }, async ({ canvas }) => {
  await expect(canvas.getByRole('button', { name: DEFAULT_LABEL })).toHaveAttribute(
    'type',
    'reset'
  );
});

Simple.test('ref gives the button element', { args: { ref: fn() } }, async ({ canvas, args }) => {
  const button = canvas.getByRole('button', { name: DEFAULT_LABEL });
  await expect(args.ref).toHaveBeenCalledWith(button);
});

Simple.test('is activated by a click', async ({ canvas, args, userEvent }) => {
  await userEvent.click(canvas.getByRole('button', { name: DEFAULT_LABEL }));
  await expect(args.onClick).toHaveBeenCalledOnce();
});

Simple.test('is activated by Enter', async ({ canvas, args, userEvent }) => {
  await userEvent.tab();
  await expect(canvas.getByRole('button', { name: DEFAULT_LABEL })).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await expect(args.onClick).toHaveBeenCalledOnce();
});

Simple.test('is activated by Space', async ({ canvas, args, userEvent }) => {
  await userEvent.tab();
  await expect(canvas.getByRole('button', { name: DEFAULT_LABEL })).toHaveFocus();
  await userEvent.keyboard(' ');
  await expect(args.onClick).toHaveBeenCalledOnce();
});

const CUSTOM_CLASS = 'test-class';
Simple.test(
  'className is added alongside nam-ui classes',
  { args: { className: CUSTOM_CLASS } },
  async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: DEFAULT_LABEL })).toHaveClass(
      ...DEFAULT_CLASSES,
      CUSTOM_CLASS
    );
  }
);

Simple.test(
  'passes other props through to the button',
  // A data attribute is written in JSX: TypeScript accepts `data-*` there, but not in `args`.
  { render: (args) => <Button {...args} id="save-button" data-testid="save" /> },
  async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: DEFAULT_LABEL });
    await expect(button).toHaveAttribute('id', 'save-button');
    await expect(button).toHaveAttribute('data-testid', 'save');
  }
);

Sizes.test('gives each size its class', async ({ canvas }) => {
  await expect(canvas.getByRole('button', { name: SIZE_LABELS.sm })).toHaveClass('nam-button--sm');
  await expect(canvas.getByRole('button', { name: SIZE_LABELS.md })).toHaveClass('nam-button--md');
  await expect(canvas.getByRole('button', { name: SIZE_LABELS.lg })).toHaveClass('nam-button--lg');
});

Disabled.test('is disabled', async ({ canvas }) => {
  const button = canvas.getByRole('button', { name: DEFAULT_LABEL });
  await expect(button).toBeDisabled();
  await expect(button).toHaveStyle({ cursor: 'not-allowed' });
});

Disabled.test('is skipped by Tab', async ({ canvas, userEvent }) => {
  await userEvent.tab();
  await expect(canvas.getByRole('button', { name: DEFAULT_LABEL })).not.toHaveFocus();
});

Disabled.test('ignores a click', async ({ canvas, args, userEvent }) => {
  await userEvent.click(canvas.getByRole('button', { name: DEFAULT_LABEL }));
  await expect(args.onClick).not.toHaveBeenCalled();
});
