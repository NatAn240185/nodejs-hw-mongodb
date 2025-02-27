import multer from 'multer';

// Налаштування сховища для файлів
const storage = multer.memoryStorage(); // Файли зберігаються в пам'яті (можна змінити на диск)

// Фільтр для дозволених типів файлів (опціонально)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Обмеження розміру 5MB
});

export default upload;
