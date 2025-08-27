// backend/src/middlewares/upload.js
import multer from "multer";
import path from "path";

// Configura onde e como salvar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "../frontend/public/products"));
  },
  filename: function (req, file, cb) {
    // ex: produto-1623456789012.png
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

export const uploadProductImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // aceitar só imagens
    const mime = file.mimetype;
    if (mime.startsWith("image/")) cb(null, true);
    else cb(new Error("Só arquivos de imagem são permitidos"), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // até 5MB
});
