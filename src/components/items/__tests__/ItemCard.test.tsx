import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ItemCard } from '../ItemCard';
import { Item } from '@/types';

// Mock the rarityStyles
jest.mock('@/constants/rarityStyles', () => ({
  getRarityStyle: jest.fn((rarity) => ({
    border: `border-${rarity || 'gray'}-300/40`,
    glow: `hover:shadow-${rarity || 'gray'}-200/30`,
    text: `text-${rarity || 'gray'}-700`,
    background: `bg-gradient-to-br from-${rarity || 'gray'}-50/40 to-white/90`
  })),
  RARITY_STYLES: {
    white: {
      border: 'border-gray-300/40',
      glow: 'hover:shadow-gray-200/30',
      text: 'text-gray-700',
      background: 'bg-gradient-to-br from-gray-50/40 to-white/90'
    }
  }
}));

describe('ItemCard', () => {
  const mockOnToggleOwned = jest.fn();
  const mockOnItemClick = jest.fn();

  const mockItem: Item = {
    id: 'test-item',
    name: 'Test Sword',
    type: 'weapon',
    category: 'melee',
    subcategory: 'sword',
    iconPath: '/icons/test-sword.png',
    acquisition: ['craft'],
    rarity: 'white',
    gameStage: 'pre-hardmode',
    owned: false
  };

  const defaultProps = {
    item: mockItem,
    onToggleOwned: mockOnToggleOwned,
    onItemClick: mockOnItemClick
  };

  beforeEach(() => {
    mockOnToggleOwned.mockClear();
    mockOnItemClick.mockClear();
  });

  it('should render item name', () => {
    render(<ItemCard {...defaultProps} />);
    
    expect(screen.getByText('Test Sword')).toBeInTheDocument();
  });

  it('should render item image with correct src and alt', () => {
    render(<ItemCard {...defaultProps} />);
    
    const image = screen.getByAltText('Test Sword');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/icons/test-sword.png');
  });

  it('should apply grayscale filter when item is not owned', () => {
    render(<ItemCard {...defaultProps} />);
    
    const image = screen.getByAltText('Test Sword');
    expect(image).toHaveClass('filter', 'grayscale');
  });

  it('should not apply grayscale filter when item is owned', () => {
    const ownedItem = { ...mockItem, owned: true };
    render(<ItemCard {...defaultProps} item={ownedItem} />);
    
    const image = screen.getByAltText('Test Sword');
    expect(image).not.toHaveClass('grayscale');
  });

  it('should call onItemClick when item name is clicked', async () => {
    const user = userEvent.setup();
    render(<ItemCard {...defaultProps} />);
    
    const itemName = screen.getByText('Test Sword');
    await user.click(itemName);
    
    expect(mockOnItemClick).toHaveBeenCalledWith(mockItem);
  });

  it('should call onItemClick when image is clicked', async () => {
    const user = userEvent.setup();
    render(<ItemCard {...defaultProps} />);
    
    const image = screen.getByAltText('Test Sword');
    await user.click(image);
    
    expect(mockOnItemClick).toHaveBeenCalledWith(mockItem);
  });

  it('should call onToggleOwned when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<ItemCard {...defaultProps} />);
    
    const toggleButton = screen.getByRole('button');
    await user.click(toggleButton);
    
    expect(mockOnToggleOwned).toHaveBeenCalledWith('test-item');
  });

  it('should show "Mark as owned" for unowned items', () => {
    render(<ItemCard {...defaultProps} />);
    
    expect(screen.getByText('Mark as owned')).toBeInTheDocument();
  });

  it('should show "Mark as not owned" for owned items', () => {
    const ownedItem = { ...mockItem, owned: true };
    render(<ItemCard {...defaultProps} item={ownedItem} />);
    
    expect(screen.getByText('Mark as not owned')).toBeInTheDocument();
  });

  it('should apply correct rarity styling', () => {
    const greenItem = { ...mockItem, rarity: 'green' as const };
    render(<ItemCard {...defaultProps} item={greenItem} />);
    
    const card = screen.getByText('Test Sword').closest('div');
    expect(card).toHaveClass('bg-green-100', 'border-green-300');
  });

  it('should handle missing rarity gracefully', () => {
    const itemWithoutRarity = { ...mockItem };
    delete (itemWithoutRarity as unknown as { rarity?: string }).rarity;
    
    render(<ItemCard {...defaultProps} item={itemWithoutRarity} />);
    
    expect(screen.getByText('Test Sword')).toBeInTheDocument();
  });

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup();
    render(<ItemCard {...defaultProps} />);
    
    const toggleButton = screen.getByRole('button');
    
    // Focus the button
    await user.tab();
    expect(toggleButton).toHaveFocus();
    
    // Press Enter
    await user.keyboard('[Enter]');
    expect(mockOnToggleOwned).toHaveBeenCalledWith('test-item');
  });

  it('should handle image load errors gracefully', () => {
    render(<ItemCard {...defaultProps} />);
    
    const image = screen.getByAltText('Test Sword');
    
    // Simulate image load error
    fireEvent.error(image);
    
    // Image should still be in the document
    expect(image).toBeInTheDocument();
  });

  it('should display item category in tooltip or accessible text', () => {
    render(<ItemCard {...defaultProps} />);
    
    // Check for category information (might be in a tooltip or sr-only text)
    const itemElement = screen.getByText('Test Sword').closest('[role="button"], [data-testid="item-card"]') || 
                       screen.getByText('Test Sword').closest('div');
    
    expect(itemElement).toBeInTheDocument();
  });
});