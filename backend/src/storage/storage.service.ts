import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private client: S3Client | null = null;

  constructor(private readonly configService: ConfigService) {}

  async uploadObject(
    key: string,
    body: Buffer,
    contentType: string,
  ): Promise<void> {
    await this.getClient().send(
      new PutObjectCommand({
        Bucket: this.getBucket(),
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  async deleteObject(key: string): Promise<void> {
    await this.getClient().send(
      new DeleteObjectCommand({
        Bucket: this.getBucket(),
        Key: key,
      }),
    );
  }

  async getSignedUrl(key: string): Promise<string> {
    return getSignedUrl(
      this.getClient(),
      new GetObjectCommand({
        Bucket: this.getBucket(),
        Key: key,
      }),
      { expiresIn: 3600 },
    );
  }

  private getClient(): S3Client {
    if (this.client) {
      return this.client;
    }

    this.client = new S3Client({
      endpoint: this.readRequiredEnv('S3_ENDPOINT'),
      region: this.readRequiredEnv('S3_REGION'),
      forcePathStyle: this.readBooleanEnv('S3_FORCE_PATH_STYLE'),
      credentials: {
        accessKeyId: this.readRequiredEnv('S3_ACCESS_KEY'),
        secretAccessKey: this.readRequiredEnv('S3_SECRET_KEY'),
      },
    });

    return this.client;
  }

  private getBucket(): string {
    return this.readRequiredEnv('S3_BUCKET');
  }

  private readRequiredEnv(key: string): string {
    const value = this.configService.get<string>(key)?.trim();

    if (!value) {
      throw new Error(`${key} is not configured.`);
    }

    return value;
  }

  private readBooleanEnv(key: string): boolean {
    return this.readRequiredEnv(key).toLowerCase() === 'true';
  }
}
