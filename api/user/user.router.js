const {
    createUser,
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    updatePasswordByUsername,
    login,
} = require('./user.controller');

const router = require('express').Router();
const { checkToken } = require('../../auth/token_validation');

router.post('/createUser', createUser);
router.get('/getUsers', checkToken, getUsers);
router.get('/getUserById/:id', checkToken, getUserById);
router.patch('/updateUserById', checkToken, updateUserById);
router.delete('/deleteUserById', checkToken, deleteUserById);
router.patch('/updatePasswordByUsername', updatePasswordByUsername);
router.post('/login', login);

module.exports = router;