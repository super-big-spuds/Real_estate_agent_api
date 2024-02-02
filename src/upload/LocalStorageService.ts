import { Injectable } from '@nestjs/common';
import { createReadStream, createWriteStream, unlink } from 'fs';
import { join } from 'path';
import { promises as fs } from 'fs';
@Injectable()
export class LocalStorageService {
  constructor() {}

  public async saveFile(
    file: Express.Multer.File,
    newFileName: string,
  ): Promise<string> {
    const targetPath = join(__dirname, '../../../src/public', newFileName);

    const tempPath = file.path;
    console.log(tempPath, 1);
    console.log(targetPath, 2);

    return new Promise((resolve, reject) => {
      const rs = createReadStream(tempPath);
      const ws = createWriteStream(targetPath);

      rs.on('error', (error) => {
        this.deleteTempFile(tempPath);
        reject(error);
      });

      ws.on('error', (error) => {
        this.deleteTempFile(tempPath);
        reject(error);
      });

      ws.on('close', () => {
        this.deleteTempFile(tempPath);
        resolve(`${process.env.BACKEND_URL}/public/${newFileName}`);
      });

      rs.pipe(ws);
    });
  }

  public async deleteFile(filename: string): Promise<boolean> {
    const filePath = join(__dirname, '../../../src/public', filename);
    try {
      await fs.unlink(filePath);
      console.log(filePath);
      return true;
    } catch (err) {
      return false;
    }
  }

  private deleteTempFile(tempPath: string) {
    unlink(tempPath, (err) => {
      if (err) {
        console.error('Error deleting temp file:', err);
      }
    });
  }
}
