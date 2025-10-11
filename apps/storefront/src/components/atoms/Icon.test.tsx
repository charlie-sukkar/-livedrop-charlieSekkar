import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Icon } from './Icon';

describe('Icon Component', () => {
  const testPath = 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6';

  const getSvg = (container: HTMLElement) => 
    container.querySelector('svg[aria-hidden="true"]') as SVGElement;

  it('renders without crashing', () => {
    const { container } = render(<Icon d={testPath} />);
    const svg = getSvg(container);
    expect(svg).toBeInTheDocument();
  });

  it('applies correct SVG attributes', () => {
    const { container } = render(<Icon d={testPath} />);
    
    const svg = getSvg(container);
    const path = svg.querySelector('path');

    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    
    expect(path).toHaveAttribute('stroke-linecap', 'round');
    expect(path).toHaveAttribute('stroke-linejoin', 'round');
    expect(path).toHaveAttribute('stroke-width', '2');
    expect(path).toHaveAttribute('d', testPath);
  });

  it('applies custom className', () => {
    const customClass = 'custom-class text-blue-500';
    const { container } = render(<Icon d={testPath} className={customClass} />);
    
    const svg = getSvg(container);
    expect(svg).toHaveClass(customClass);
  });

  it('renders without className when not provided', () => {
    const { container } = render(<Icon d={testPath} />);
    
    const svg = getSvg(container);
    // For SVG elements, we need to check the class attribute directly
    expect(svg.getAttribute('class')).toBeNull();
  });

  it('uses currentColor for stroke', () => {
    const { container } = render(<Icon d={testPath} />);
    
    const svg = getSvg(container);
    expect(svg).toHaveAttribute('stroke', 'currentColor');
  });

  it('handles different path data correctly', () => {
    const customPath = 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5';
    
    const { container } = render(<Icon d={customPath} />);
    
    const svg = getSvg(container);
    const path = svg.querySelector('path');
    expect(path).toHaveAttribute('d', customPath);
  });

  it('matches snapshot with default props', () => {
    const { container } = render(<Icon d={testPath} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with custom className', () => {
    const { container } = render(<Icon d={testPath} className="w-8 h-8 text-red-500" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});