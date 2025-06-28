
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  Square, 
  Circle, 
  Image, 
  Type,
  Search,
  Layers,
  Component,
  Palette,
  Eye,
  EyeOff
} from 'lucide-react';
import { FigmaFile, FigmaNode } from '../../types/figma-api';
import { cn } from '../../lib/utils';

interface FigmaFileExplorerProps {
  figmaData: FigmaFile;
  onNodeSelect?: (node: FigmaNode) => void;
  className?: string;
}

interface TreeNodeProps {
  node: FigmaNode;
  depth: number;
  onSelect?: (node: FigmaNode) => void;
  searchTerm: string;
  selectedNodeId?: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({ 
  node, 
  depth, 
  onSelect, 
  searchTerm,
  selectedNodeId 
}) => {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const [isVisible, setIsVisible] = useState(true);
  
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;
  
  // Filter nodes based on search term
  const matchesSearch = !searchTerm || 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.type.toLowerCase().includes(searchTerm.toLowerCase());

  const filteredChildren = node.children?.filter(child => 
    !searchTerm || matchesSearch || hasMatchingDescendant(child, searchTerm)
  );

  const getNodeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'frame':
      case 'group':
        return <Square className="h-4 w-4 text-blue-500" />;
      case 'rectangle':
      case 'ellipse':
        return <Circle className="h-4 w-4 text-green-500" />;
      case 'text':
        return <Type className="h-4 w-4 text-purple-500" />;
      case 'image':
        return <Image className="h-4 w-4 text-orange-500" />;
      case 'component':
      case 'instance':
        return <Component className="h-4 w-4 text-pink-500" />;
      default:
        return <Layers className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNodeTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'frame': return 'bg-blue-100 text-blue-800';
      case 'group': return 'bg-green-100 text-green-800';
      case 'text': return 'bg-purple-100 text-purple-800';
      case 'rectangle': return 'bg-orange-100 text-orange-800';
      case 'component': return 'bg-pink-100 text-pink-800';
      case 'instance': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!matchesSearch && !filteredChildren?.length) {
    return null;
  }

  return (
    <div className={cn(!isVisible && "opacity-50")}>
      <div
        className={cn(
          "flex items-center space-x-2 p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
          isSelected && "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
          onSelect?.(node);
        }}
      >
        {hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        ) : (
          <div className="h-4 w-4" />
        )}

        {getNodeIcon(node.type)}

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className={cn(
              "font-medium text-sm truncate",
              searchTerm && matchesSearch && "bg-yellow-200 dark:bg-yellow-800"
            )}>
              {node.name || 'Unnamed'}
            </span>
            
            <Badge 
              variant="secondary" 
              className={cn("text-xs", getNodeTypeColor(node.type))}
            >
              {node.type}
            </Badge>
          </div>
          
          {node.characters && (
            <div className="text-xs text-gray-500 truncate mt-1">
              "{node.characters.slice(0, 50)}{node.characters.length > 50 ? '...' : ''}"
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(!isVisible);
          }}
        >
          {isVisible ? (
            <Eye className="h-3 w-3" />
          ) : (
            <EyeOff className="h-3 w-3" />
          )}
        </Button>
      </div>

      {hasChildren && isExpanded && filteredChildren && (
        <div>
          {filteredChildren.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              searchTerm={searchTerm}
              selectedNodeId={selectedNodeId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to check if a node has matching descendants
function hasMatchingDescendant(node: FigmaNode, searchTerm: string): boolean {
  const matches = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 node.type.toLowerCase().includes(searchTerm.toLowerCase());
  
  if (matches) return true;
  
  if (node.children) {
    return node.children.some(child => hasMatchingDescendant(child, searchTerm));
  }
  
  return false;
}

export const FigmaFileExplorer: React.FC<FigmaFileExplorerProps> = ({
  figmaData,
  onNodeSelect,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string>();

  const handleNodeSelect = (node: FigmaNode) => {
    setSelectedNodeId(node.id);
    onNodeSelect?.(node);
  };

  const totalNodes = countNodes(figmaData.document);
  const componentCount = Object.keys(figmaData.components || {}).length;
  const styleCount = Object.keys(figmaData.styles || {}).length;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">{figmaData.name}</CardTitle>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Badge variant="outline" className="text-xs">
              v{figmaData.version}
            </Badge>
            <span>•</span>
            <span>{new Date(figmaData.lastModified).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Layers className="h-4 w-4" />
            <span>{totalNodes} nodes</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Component className="h-4 w-4" />
            <span>{componentCount} components</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Palette className="h-4 w-4" />
            <span>{styleCount} styles</span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="p-4 space-y-1">
            <TreeNode
              node={figmaData.document}
              depth={0}
              onSelect={handleNodeSelect}
              searchTerm={searchTerm}
              selectedNodeId={selectedNodeId}
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Helper function to count total nodes
function countNodes(node: FigmaNode): number {
  let count = 1;
  if (node.children) {
    count += node.children.reduce((sum, child) => sum + countNodes(child), 0);
  }
  return count;
}
