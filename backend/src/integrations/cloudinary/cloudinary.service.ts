import { Injectable, OnModuleInit, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

/** Allowed file MIME types for media uploads. */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

@Injectable()
export class CloudinaryService implements OnModuleInit {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.getOrThrow('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow('CLOUDINARY_API_SECRET'),
    });

    this.logger.log('Cloudinary client initialized');
  }

  /**
   * Uploads a single file buffer to Cloudinary.
   * Returns the secure URL and public ID.
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'civic-alerts/reports',
  ): Promise<{ url: string; publicId: string; thumbnailUrl?: string }> {
    this.validateFile(file);

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype);
    const resourceType = isVideo ? 'video' : 'image';

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          transformation: isVideo
            ? undefined
            : [{ width: 1200, crop: 'limit', quality: 'auto', format: 'webp' }],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            this.logger.error('Cloudinary upload failed', error);
            return reject(new BadRequestException('File upload failed'));
          }

          const thumbnailUrl = isVideo
            ? result.secure_url.replace('/upload/', '/upload/w_400,h_300,c_fill,so_0/')
            : result.secure_url.replace('/upload/', '/upload/w_400,h_300,c_fill/');

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            thumbnailUrl,
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Uploads multiple files and returns all URLs.
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<{ urls: string[]; thumbnailUrl: string }> {
    const results = await Promise.all(
      files.map((file) => this.uploadFile(file, folder)),
    );

    return {
      urls: results.map((r) => r.url),
      thumbnailUrl: results[0]?.thumbnailUrl ?? '',
    };
  }

  /** Deletes a file from Cloudinary by its public ID. */
  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  /** Validates file type and size. */
  private validateFile(file: Express.Multer.File): void {
    const allAllowed = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

    if (!allAllowed.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed: ${allAllowed.join(', ')}`,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 10MB`,
      );
    }
  }
}
