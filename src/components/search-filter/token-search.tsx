
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TokenType, TokenCategory } from '@/types/design-tokens';
import { Filter, X } from 'lucide-react';

export function TokenSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<TokenType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<TokenCategory[]>([]);

  const handleTypeToggle = (type: TokenType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleCategoryToggle = (category: TokenCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedCategories([]);
  };

  const activeFiltersCount = selectedTypes.length + selectedCategories.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Filter Tokens</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Token Types</Label>
              <div className="mt-2 space-y-2">
                {Object.values(TokenType).map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={() => handleTypeToggle(type)}
                    />
                    <Label 
                      htmlFor={`type-${type}`}
                      className="text-sm capitalize cursor-pointer"
                    >
                      {type.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium">Categories</Label>
              <div className="mt-2 space-y-2">
                {Object.values(TokenCategory).map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <Label 
                      htmlFor={`category-${category}`}
                      className="text-sm capitalize cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
