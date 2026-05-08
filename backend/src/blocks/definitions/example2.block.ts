import { BlockDefinition } from '../block.definition';

export class Example2Block extends BlockDefinition {
  readonly type = 'example2' as const;
  readonly label = 'Ejemplo 2';
  readonly description = 'Bloque de texto enriquecido';
  readonly icon = 'text_fields';
  readonly previewKey = 'block-text-v1';
  readonly mustFill = true;
  readonly layout = { minCols: 2, minRows: 1, resizable: true };
}
