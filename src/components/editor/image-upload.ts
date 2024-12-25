/* eslint-disable @typescript-eslint/no-explicit-any */
import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";

const onUpload = (file: File) => {
  // Create FormData object
  const formData = new FormData();
  formData.append("image", file, file?.name || "image.png");

  const promise = fetch("/api/admin/blog/image_upload", {
    method: "POST",
    body: formData, // Send the file wrapped in FormData
  });

  return new Promise((resolve) => {
    toast.promise(
      promise.then(async (res) => {
        // Successfully uploaded image
        if (res.status === 200) {
          const { url } = (await res.json()) as any;
          // Preload the image
          // eslint-disable-next-line prefer-const
          let image = new Image();
          image.src = url;
          image.onload = () => {
            resolve(url);
          };
          // No blob store configured
        } else if (res.status === 401) {
          resolve(file);
          throw new Error(
            "`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead."
          );
          // Unknown error
        } else {
          throw new Error(`Error uploading image. Please try again.`);
        }
      }),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully.",
        error: (e) => e.message,
      }
    );
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    } else if (file.size / 1024 / 1024 > 4) {
      toast.error("File size too big (max 4MB).");
      return false;
    }
    return true;
  },
});
