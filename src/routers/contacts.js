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
import upload from "../middlewares/upload.js"; // Переконайся, що шлях правильний

const router = express.Router();

router.get('/', ctrlWrapper(getContactsControllers));

router.get('/:contactId', isValidId, ctrlWrapper(getContactsIdControllers));

router.post('/', upload.single("photo"), validateBody(contactSchemaJoi), ctrlWrapper(createContactController));

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

router.patch('/:contactId', isValidId, upload.single("photo"), validateBody(replaceContactSchemaJoi), ctrlWrapper(updateContactController));

export default router;
