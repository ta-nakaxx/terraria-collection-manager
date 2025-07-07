import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    value: '',
    onChange: mockOnChange,
    placeholder: 'Search items...'
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render with placeholder text', () => {
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search items...');
    expect(input).toBeInTheDocument();
  });

  it('should display the provided value', () => {
    render(<SearchBar {...defaultProps} value="test query" />);
    
    const input = screen.getByDisplayValue('test query');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when user types', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search items...');
    
    await user.type(input, 'sword');
    
    // Should be called for each character typed
    expect(mockOnChange).toHaveBeenCalledTimes(5);
    expect(mockOnChange).toHaveBeenLastCalledWith('sword');
  });

  it('should handle backspace and deletion', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} value="test" />);
    
    const input = screen.getByDisplayValue('test');
    
    // Clear the input
    await user.clear(input);
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('should handle paste events', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search items...');
    
    // Simulate paste
    await user.click(input);
    await user.paste('pasted content');
    
    expect(mockOnChange).toHaveBeenCalledWith('pasted content');
  });

  it('should render search icon', () => {
    render(<SearchBar {...defaultProps} />);
    
    // Check for the search icon by looking for svg element
    const searchIcon = screen.getByRole('textbox').previousSibling;
    expect(searchIcon).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search items...');
    expect(input).toHaveClass('flex-1', 'bg-transparent');
  });

  it('should be accessible', () => {
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should handle focus and blur events', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search items...');
    
    await user.click(input);
    expect(input).toHaveFocus();
    
    await user.tab();
    expect(input).not.toHaveFocus();
  });
});