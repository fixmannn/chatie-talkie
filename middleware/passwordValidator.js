const passwordValidator = require('password-validator');
const schema = new passwordValidator();


const passwordSchema = schema
  .is().min(8)
  .is().max(32)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)
  .has().not().spaces();

const validatePassword = (password) => {
  const passwordValid = passwordSchema.validate(password);

  if (passwordValid) return true;
  return false;
}


module.exports = {
  validatePassword: validatePassword
};