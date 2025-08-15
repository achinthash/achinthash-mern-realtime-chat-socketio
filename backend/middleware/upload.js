// import multer from "multer";
// import path from 'path';

// const storage = multer.diskStorage({
//     destination : function (req,file,cb){
//         cb(null, 'uploads/');
//     },

//     filename : function (req,file,cb){
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         const ext = path.extname(file.originalname);
//         cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//     }
// });

// const fileFilter = (req,file,cb) =>{
//     const allowed = ['image/jpeg', 'image/png', 'image/jpg'];

//     allowed.includes(file.mimetype) ? cb(null , true) : cb(new Error('Invalid file type', false));
// }

// const upload = multer({storage, fileFilter});

// export default upload;


import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
  
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
