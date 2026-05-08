import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockInstance } from '../../../packages/shared/src/types/block.types.js';

@Controller()
export class BlockController {
    constructor(private readonly blockService: BlockService) {}

    @Get('blocks/definitions')
    listDefinitions() {
        return this.blockService.listDefinitions();
    }

    @Post('templates/:id/blocks')
    saveBlocks(
        @Param('id') templateId: string,
        @Body() body: { blocks: Omit<BlockInstance, 'localId'>[] },
    ) {
        return this.blockService.saveBlocks(templateId, body.blocks);
    }
}
