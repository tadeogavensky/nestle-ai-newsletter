import { Injectable, NotFoundException } from '@nestjs/common';
import { block_content_type } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CreateNewsletterBody,
  NewsletterBlockInput,
  UpdateNewsletterBody,
  UpdateNewsletterStatusBody,
} from './newsletters.schemas';

type MappedBlock = {
  id: string;
  name: string;
  text: string;
  backgroundColor: string;
  comment: null;
};

type MappedNewsletter = {
  id: string;
  creatorUserId: string | null;
  state: string;
  templateId: string | null;
  brandKitId: string | null;
  blocks: MappedBlock[];
  comment: null;
  generationRequest: null;
  renderedHtml: null;
  createdAt: string;
  updatedAt: string;
};

type NewsletterWithBlocks = {
  id: string;
  title: string;
  state: string;
  created_by_user_id: string | null;
  template_id: string | null;
  brand_kit_id: string | null;
  created_at: Date;
  updated_at: Date;
  newsletter_blocks: Array<{
    block_content: {
      id: string;
      content: string | null;
    };
  }>;
};

@Injectable()
export class NewsLettersService {
  constructor(private prisma: PrismaService) {}

  async getAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.newsletters.findMany({
        where: { deleted_at: null },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          users_newsletters_created_by_user_idTousers: {
            select: { name: true, last_name: true },
          },
        },
      }),
      this.prisma.newsletters.count({ where: { deleted_at: null } }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async create(body: CreateNewsletterBody, userId?: string): Promise<MappedNewsletter> {
    const newsletter = await this.prisma.$transaction(async (tx) => {
      const created = await tx.newsletters.create({
        data: {
          title: body.title ?? 'Nuevo Newsletter',
          area_id: body.areaId ?? null,
          theme_tag: body.themeTag ?? null,
          brand_kit_id: body.brandKitId ?? null,
          template_id: body.templateId ?? null,
          created_by_user_id: userId ?? body.createdByUserId ?? null,
          state: body.state ?? 'DRAFT',
          language: body.language ?? 'SPA',
          format: body.format ?? 'PORTRAIT',
        },
      });

      if (body.blocks && body.blocks.length > 0) {
        await this.createBlocks(tx, created.id, body.blocks);
      }

      return created;
    });

    return this.getById(newsletter.id);
  }

  async getById(id: string): Promise<MappedNewsletter> {
    const newsletter = await this.prisma.newsletters.findFirst({
      where: { id, deleted_at: null },
      include: {
        newsletter_blocks: {
          where: { deleted_at: null },
          orderBy: { display_order: 'asc' },
          include: { block_content: true },
        },
      },
    });

    if (!newsletter) {
      throw new NotFoundException(`Newsletter con ID ${id} no encontrado`);
    }

    return this.mapNewsletter(newsletter as unknown as NewsletterWithBlocks);
  }

  async update(id: string, body: UpdateNewsletterBody): Promise<MappedNewsletter> {
    const existing = await this.prisma.newsletters.findFirst({ where: { id, deleted_at: null } });
    if (!existing) {
      throw new NotFoundException(`Newsletter con ID ${id} no encontrado`);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.newsletters.update({
        where: { id },
        data: {
          ...(body.title !== undefined && { title: body.title }),
          ...(body.brandKitId !== undefined && { brand_kit_id: body.brandKitId }),
          ...(body.templateId !== undefined && { template_id: body.templateId }),
          ...(body.state !== undefined && { state: body.state }),
          updated_at: new Date(),
        },
      });

      if (body.blocks !== undefined) {
        const existingLinks = await tx.newsletter_blocks.findMany({
          where: { newsletter_id: id, deleted_at: null },
          select: { block_content_id: true },
        });
        await tx.newsletter_blocks.deleteMany({ where: { newsletter_id: id } });
        if (existingLinks.length > 0) {
          await tx.block_content.deleteMany({
            where: { id: { in: existingLinks.map((l) => l.block_content_id) } },
          });
        }
        await this.createBlocks(tx, id, body.blocks);
      }
    });

    return this.getById(id);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.newsletters.findFirst({ where: { id, deleted_at: null } });
    if (!existing) {
      throw new NotFoundException(`Newsletter con ID ${id} no encontrado`);
    }
    await this.prisma.newsletters.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async updateStatus(id: string, body: UpdateNewsletterStatusBody): Promise<MappedNewsletter> {
    const existing = await this.prisma.newsletters.findFirst({ where: { id, deleted_at: null } });
    if (!existing) {
      throw new NotFoundException(`Newsletter con ID ${id} no encontrado`);
    }
    await this.prisma.newsletters.update({
      where: { id },
      data: { state: body.state, updated_at: new Date() },
    });
    return this.getById(id);
  }

  getLogs(id: string) {
    return `Desde logs newsletters con ID ${id}`;
  }

  addLog(id: string) {
    return `Desde add log newsletters con ID ${id}`;
  }

  getComments(id: string) {
    return `Desde comments newsletters con ID ${id}`;
  }

  addComment(id: string) {
    return `Desde add comment newsletters con ID ${id}`;
  }

  updateComment(id: string, commentId: string) {
    return `Desde update comment newsletters con ID ${id} y commentId ${commentId}`;
  }

  updateExports(id: string, exportId: string) {
    return `Desde update exports newsletters con ID ${id} y exportId ${exportId}`;
  }

  getExports(id: string) {
    return `Desde exports newsletters con ID ${id}`;
  }

  private async createBlocks(
    tx: Parameters<Parameters<PrismaService['$transaction']>[0]>[0],
    newsletterId: string,
    blocks: NewsletterBlockInput[],
  ): Promise<void> {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const blockContent = await tx.block_content.create({
        data: {
          content: JSON.stringify({ name: block.name, text: block.text, backgroundColor: block.backgroundColor }),
          type: block_content_type.CONTENT,
          display_order: i,
          must_fill: false,
        },
      });
      await tx.newsletter_blocks.create({
        data: {
          newsletter_id: newsletterId,
          block_content_id: blockContent.id,
          display_order: i,
        },
      });
    }
  }

  private mapNewsletter(newsletter: NewsletterWithBlocks): MappedNewsletter {
    const blocks: MappedBlock[] = newsletter.newsletter_blocks.map((nb) => {
      let name = '';
      let text = '';
      let backgroundColor = '#FFFFFF';
      try {
        const parsed = JSON.parse(nb.block_content.content ?? '{}') as {
          name?: string;
          text?: string;
          backgroundColor?: string;
        };
        name = parsed.name ?? '';
        text = parsed.text ?? '';
        backgroundColor = parsed.backgroundColor ?? '#FFFFFF';
      } catch {
        // ignore
      }
      return { id: nb.block_content.id, name, text, backgroundColor, comment: null };
    });

    return {
      id: newsletter.id,
      creatorUserId: newsletter.created_by_user_id,
      state: newsletter.state,
      templateId: newsletter.template_id,
      brandKitId: newsletter.brand_kit_id,
      blocks,
      comment: null,
      generationRequest: null,
      renderedHtml: null,
      createdAt: newsletter.created_at.toISOString(),
      updatedAt: newsletter.updated_at.toISOString(),
    };
  }
}
