/**
 * UserService.js
 * HMACSHA512 hashing for user registration and authentication
 */

const userRepository = require('../repositories/UserRepository');
const crypto = require('crypto');

const usersService = {
  authenticate: async (loginDto) => {
    const { username, password } = loginDto;

    // Find the user
    const user = await userRepository.getByUsername(username);
    if (!user) throw new Error('The username or password is incorrect');

    // Check login password against the stored hash
    const { passwordHash, passwordSalt } = user;
    if (!_verifyPassword(password, passwordHash, passwordSalt))
      throw new Error('The username or password is incorrect');

    return user;
  },
  create: async (registerDto) => {
    // Check if the username already exists
    const user = await userRepository.getByUsername(registerDto.username);
    if (user) throw new Error(`The username ${registerDto.username} is already taken`);

    // Create salt and hash from password
    const { passwordHash, passwordSalt } = _createPasswordHash(registerDto.password);

    // Map to a userDto object
    const userDto = {
      firstname: registerDto.firstname,
      lastname: registerDto.lastname,
      username: registerDto.username,
      passwordHash,
      passwordSalt,
    };

    // Save the user
    await userRepository.save(userDto);
  },
};

const _verifyPassword = (password, userHash, userSalt) => {
  if (!password) throw new Error('Password is required');
  if (userHash.length !== 64) throw new Error('Invalid length of password hash (64 bytes expected');
  if (userSalt.length !== 128)
    throw new Error('Invalid length of password salt (128 bytes expected');

  const hmac = crypto.createHmac('sha512', userSalt);
  hmac.update(password);
  const computedHash = hmac.digest();
  for (let i = 0; i < userHash.length; i++) {
    if (userHash[i] !== computedHash[i]) return false;
  }

  return true;
};

const _createPasswordHash = (password) => {
  const passwordSalt = _generateSalt();
  const hmac = crypto.createHmac('sha512', passwordSalt);
  hmac.update(password);
  const passwordHash = hmac.digest();
  return { passwordHash, passwordSalt };
};

const _generateSalt = () => {
  return crypto.randomBytes(Math.ceil(128));
};

module.exports = usersService;
