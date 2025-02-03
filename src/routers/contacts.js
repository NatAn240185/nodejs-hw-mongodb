import express from 'express';
import { getContactsControllers, getContactsIdControllers, createContactController, deleteContactController, updateContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';


const router = express.Router();
const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContactsControllers));

router.get('/contacts/:contactId', ctrlWrapper(getContactsIdControllers));

router.post('/contacts', jsonParser, ctrlWrapper(createContactController));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

router.patch('/contacts/:contactId', jsonParser, ctrlWrapper(updateContactController));


export default router;
