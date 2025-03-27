import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {
createRoom,
  getAllRooms,
  getRoomById,
  getRoomsByFloor,
  updateRoom,
  deleteRoom
} from '../Controllers/roomController.js'

const router = express.Router(); 

router.post('/create',authMiddleware,createRoom)
router.get('/getall',authMiddleware,getAllRooms)
router.get('/get/:id',authMiddleware,getRoomById)
router.get("/floor/:floorId",authMiddleware, getRoomsByFloor);
router.put('/put/:id',authMiddleware,updateRoom)
router.delete('/delete/:id',authMiddleware,deleteRoom)

export default router;