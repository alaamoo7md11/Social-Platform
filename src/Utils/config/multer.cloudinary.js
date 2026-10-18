import multer, { diskStorage } from "multer";
export const uploadCloud = () => {
   const storage = diskStorage({}); //temp data
  const multerFiles = multer({ storage });
  return multerFiles;
};
