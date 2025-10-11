import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders label correctly', () => {
    render(<Tag label="React" />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('applies active styling when isActive is true', () => {
    const { container } = render(<Tag label="React" isActive={true} />);
    const tag = container.firstChild as HTMLElement;
    expect(tag).toHaveClass('bg-blue-600', 'text-white');
  });

  it('applies inactive styling when isActive is false', () => {
    const { container } = render(<Tag label="React" isActive={false} />);
    const tag = container.firstChild as HTMLElement;
    expect(tag).toHaveClass('bg-gray-200', 'text-gray-800');
  });

  it('shows remove button when removable is true', () => {
    render(<Tag label="React" removable={true} />);
    expect(screen.getByLabelText('Remove React')).toBeInTheDocument();
  });

  it('hides remove button when removable is false', () => {
    render(<Tag label="React" removable={false} />);
    expect(screen.queryByLabelText('Remove React')).not.toBeInTheDocument();
  });

  it('calls onClick when tag is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Tag label="React" onClick={onClick} />);
    
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Tag label="React" removable={true} onRemove={onRemove} />);
    
    await user.click(screen.getByLabelText('Remove React'));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('has button role when onClick is provided', () => {
    render(<Tag label="React" onClick={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Tag label="React" className="custom-class" />);
    const tag = container.firstChild as HTMLElement;
    expect(tag).toHaveClass('custom-class');
  });
});