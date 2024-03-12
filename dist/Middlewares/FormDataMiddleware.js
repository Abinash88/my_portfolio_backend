import multer from "multer";
// import fs from "fs";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// console.log(path.join(__dirname, "myUploads/"));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/myUploads/");
    },
    filename: function (req, file, cb) {
        const uniqeSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
        cb(null, file.originalname +
            "_" +
            uniqeSuffix +
            "-" +
            file.originalname.split(".").pop());
    },
});
export const upload = multer({ storage: storage, preservePath: true });
//# sourceMappingURL=FormDataMiddleware.js.map