const isJWT = require('validator/lib/isJWT')
const isUUID = require('validator/lib/isUUID')
const { BaseModel, Rule } = require('supra-core')

const schema = {
  ...BaseModel.genericSchema,

  id: new Rule({
    validator: v => isUUID(v),
    description: 'UUID;'
  }),
  email: new Rule({
    validator: v => isEmail(v) && v.length <= 50,
    description: 'string; email; max 50 chars;'
  }),
  passwordHash: new Rule({
    validator: v => typeof v === 'string' && v.length >= 8,
    description: 'string; min 8 chars;'
  }),
  created_date: new Rule({
    validator: v => (typeof v === 'string') && v.length >= 3 && v.length <= 300,
    description: 'string; min 3; max 300 chars;'
  }),
  modified_date: new Rule({
    validator: v => (typeof v === 'string') && v.length >= 3 && v.length <= 300,
    description: 'string; min 3; max 300 chars;'
  })
}

class UserModel extends BaseModel {
  static get schema () {
    return schema
  }

  /**
   * Create A User
   * @param {object} req 
   * @returns {object} employee object 
   */
  async create(req, hash) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({'message': 'Some values are missing'});
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }
   
    // const hashPassword = Helper.hashPassword(req.body.password);

    const createQuery = `INSERT INTO
      users(id, email, password, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
    const values = [
      uuidv4(),
      req.body.email,
      hash,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(createQuery, values);
      // const token = Helper.generateToken(rows[0].id);
      
      req.login(user, function(err) {
        console.log(user)
        if (err) { return next(err); }
      });

      return res.status(201).send({ token });
    } catch(error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ 'message': 'User with that EMAIL already exist' })
      }
      return res.status(400).send(error);
    }
  }
}

module.exports = UserModel
