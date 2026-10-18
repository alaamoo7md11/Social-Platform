import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
export const fileValidation = {
  images: ["image/jpeg", "image/png"],
  files: ["application/pdf"],
};
export const upload = (fileType,folder) => {
  const storage = diskStorage({
    destination: folder,
    filename: (req, file, cb) => {
      cb(null, nanoid() + "$$" + file.originalname);
    },
  });
  const fileFilter = function (req, file, cb) {
    if (!fileType.includes(file.mimetype))
      return cb(
        new Error(`invalid format we only accept ${JSON.stringify(fileType)}`),
        false,
      );
    return cb(null, true);
  };
  const multerFiles = multer({ storage, fileFilter });
  return multerFiles;
};
