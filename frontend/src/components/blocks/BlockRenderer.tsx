import type { BlockInstance } from "../../../../packages/shared/src/types/block.types";
import { Example1Renderer } from "./renderers/Example1Renderer";
import { Example2Renderer } from "./renderers/Example2Renderer";

interface Props {block: BlockInstance; editMode?: boolean;}

export function BlockRenderer({ block }: Props) {
  switch (block.type) {
    case "LAYOUT":
      return <Example1Renderer block={block} />;
    case "BASE":
      return <Example2Renderer block={block} />;
    default:
      return null;
  }
}
