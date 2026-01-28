import { Router } from 'express';
import { serviceController } from '../controllers/serviceController';

const router = Router();

// Service routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);
router.post('/calculate-price', serviceController.calculatePrice);

export default router;