import type { AdminMediaService } from "@/lib/api/contracts/admin-media-service";

export const mockAdminMediaService: AdminMediaService = {
  async upload(file) {
    return {
      id: `media_mock_${Date.now()}`,
      url: URL.createObjectURL(file),
      alt: file.name,
      position: 0,
    };
  },
};
