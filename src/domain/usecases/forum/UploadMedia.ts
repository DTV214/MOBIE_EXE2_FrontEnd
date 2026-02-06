import { IForumRepository } from "../../repositories/forum/IForumRepository";


export class UploadMedia {
  constructor(private forumRepository: IForumRepository) {}

  /**
   * Tải tập tin (ảnh/video) lên server.
   * Trả về chuỗi URL duy nhất từ Cloudinary.
   */
  async execute(file: any): Promise<string> {
    return await this.forumRepository.uploadMedia(file);
  }
}
