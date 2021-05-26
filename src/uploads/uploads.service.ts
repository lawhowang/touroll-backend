import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { nanoid } from 'nanoid';
import * as AWS from 'aws-sdk';
import * as path from 'path'
const s3 = new AWS.S3()

const URL_EXPIRATION_SECONDS = 300

@Injectable()
export class UploadsService {
  async create(createUploadDto: CreateUploadDto) {
    const randomID = nanoid()
    const Key = `temp/${randomID}.jpg`

    // Get signed URL from S3
    const s3Params = {
      Bucket: 'touroll',
      Key,
      Expires: URL_EXPIRATION_SECONDS,
      ContentType: 'image/jpeg',

      // This ACL makes the uploaded object publicly readable. You must also uncomment
      // the extra permission for the Lambda function in the SAM template.

      //ACL: 'public-read'
    }
    const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params)
    return { uploadURL }
  }

  async confirmFile(identifier: string, destinationPath: string, prefix?: string) {
    const newId = `${prefix || ''}${identifier}`
    await this.copyFile(`temp/${identifier}.jpg`, path.join(destinationPath, `${newId}.jpg`))
    return newId
  }

  private copyFile(source: string, key: string) {
    return new Promise((res, rej) => {
      const params = {
        CopySource: 'touroll/' + source,
        Bucket: 'touroll',
        Key: key,
        ACL: 'public-read'
      };
      s3.copyObject(params, function (err, data) {
        if (err) {
          rej(err)
        } else {
          res(data)
        }
      })
    })
  }
  async _deleteFile(file: string) {
    return new Promise((res, rej) => {
      const params = {
        Bucket: 'touroll',
        Key: file
      };
      s3.deleteObject(params, function (err, data) {
        if (err) {
          rej(err)
        } else {
          res(data)
        }
      })
    })
  }
  async deleteFile(identifier: string, filePath: string) {
    return await this._deleteFile(path.join(filePath, `${identifier}.jpg`))
  }
  // findAll() {
  //   return `This action returns all uploads`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} upload`;
  // }

  // update(id: number, updateUploadDto: UpdateUploadDto) {
  //   return `This action updates a #${id} upload`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} upload`;
  // }
}
