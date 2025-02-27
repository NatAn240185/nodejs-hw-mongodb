import express from 'express';
import { 
    getContactsControllers, 
    getContactsIdControllers, 
    createContactController, 
    deleteContactController, 
    updateContactController 
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchemaJoi, replaceContactSchemaJoi } from "../validation/contactValidation.js";
import upload from '../middlewares/upload.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContactsControllers));

router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactsIdControllers));

// Додаємо upload.single('photo') у вже існуючий роут
router.post('/contacts', 
    jsonParser, 
    upload.single('photo'), 
    validateBody(contactSchemaJoi), 
    async (req, res, next) => {
        try {
            const { name, email, phone } = req.body;
            const photo = req.file ? req.file.buffer.toString('base64') : null; 

            const newContact = await createContactController({ name, email, phone, photo });

            res.status(201).json({ message: 'Contact created', data: newContact });
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));

// PATCH з підтримкою фото
router.patch('/contacts/:contactId', 
    isValidId, 
    jsonParser, 
    upload.single('photo'), 
    validateBody(replaceContactSchemaJoi), 
    async (req, res, next) => {
        try {
            const { contactId } = req.params;
            const updates = req.body;

            if (req.file) {
                updates.photo = req.file.buffer.toString('base64');
            }

            const updatedContact = await updateContactController(contactId, updates);

            res.status(200).json({ message: 'Contact updated', data: updatedContact });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
