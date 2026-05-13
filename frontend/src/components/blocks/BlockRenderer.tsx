import type { ColumnObject } from "../../interfaces/interfaces.templates";
import { Example1Renderer } from "./renderers/Example1Renderer";
import { Example2Renderer } from "./renderers/Example2Renderer";
import { Box, Typography } from "@mui/material";

interface Props {
  block: ColumnObject;
  editMode?: boolean;
}

export function BlockRenderer({ block, editMode = false }: Props) {
  if (!block.type) {
    return (
      <Box sx={{ 
        p: 2, 
        height: '100%',
        width: '100%',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed',
        borderColor: 'divider',
        textAlign: 'center',
        color: 'text.disabled',
        boxSizing: 'border-box'
      }}>
        <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
          Columna {block.displayOrder + 1}
        </Typography>
      </Box>
    );
  }

  const blockInstance = {
    localId: block.id,
    type: block.type as any,
    content: block.content,
    mustFill: block.mustFill,
    displayOrder: block.displayOrder
  };

  switch (block.type) {
    case "LAYOUT":
      return <Example1Renderer block={blockInstance} editMode={editMode} />;
    case "BASE":
      return <Example2Renderer block={blockInstance} editMode={editMode} />;
    default:
      return (
        <Box sx={{ p: 2, textAlign: 'center', color: 'text.disabled' }}>
          <Typography variant="caption">Bloque: {block.type}</Typography>
          <Typography variant="body2">{block.content || 'Sin contenido'}</Typography>
        </Box>
      );
  }
}
