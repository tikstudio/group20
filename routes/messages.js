import { Router } from 'express';
import validate from '../middlewares/validate';
import messagesSchema from '../schema/messagesSchema';
import MessagesController from '../controllers/MessagesController';
import uploader from '../middlewares/uploader';

const router = Router();

router.post(
  '/send',
  uploader([]).array('files[]', 12),
  validate(messagesSchema.send),
  MessagesController.send,
);

router.get(
  '/list/:friendId',
  MessagesController.list,
);
router.get(
  '/open/:messageId',
  MessagesController.open,
);

export default router;
