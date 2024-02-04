const express = require('express');

const { 
  signupUser, 
  loginUser, 
  addItemToList,
  removeItemFromList,
  getUserList,
  subscribeUser,       
  cancelSubscription ,
  getSubscriptionStatus  
} = require('../controllers/userController');

const router = express.Router();


const requireAuth = require('../middleware/requireAuth'); 


router.post('/login', loginUser);


router.post('/signup', signupUser);


router.post('/mylist/add', requireAuth, addItemToList);


router.delete('/mylist/remove', requireAuth, removeItemFromList);


router.get('/mylist', requireAuth, getUserList);


router.post('/subscribe', requireAuth, subscribeUser);


router.post('/cancel-subscription', requireAuth, cancelSubscription);

router.get('/subscription-status', requireAuth, getSubscriptionStatus);

module.exports = router;
