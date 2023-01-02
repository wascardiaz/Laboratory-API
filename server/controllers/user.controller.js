const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const Role = require('../helpers/role');
const bcrypt = require("bcryptjs");

var path = require('path');

const { getFile } = require('../helpers/file-exists');

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.username) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a User
  const user = {
    username: req.body.username,
    emailId: req.body.emailId,
    roleId: parseInt(req.body.roleId, 10),
    userGroupId: parseInt(req.body.userGroupId, 10),
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    status: req.body.status ? '1' : '0'
  };
  // Save User in the database
  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all Resultados from the database.
exports.findAll = async (req, res) => {
  const username = req.query.username;
  const personId = req.query.personId;
  var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
  var condition = personId ? { personId: { [Op.eq]: `${personId}` } } : null;

  const users = await User.findAll({ where: condition, include: [db.role, db.person] });
  // return users.map(x => basicDetails(x));

  res.status(200).json(users);
};

// Find a single User with an id
exports.findOne = async (req, res) => {
  // users can get their own account and admins can get any account
  if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
    res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await getUser(req.params.id);
  const picture = user.username ? getFile(user.username, path.join(__basedir, process.env.AVATAR_STORAGE), baseUrl = 'http://localhost:3800/api/users/pic') : null;

  res.status(200).json({ pic: picture, ...user.dataValues });// basicDetails(user);
};

// Update a User by the id in the request
exports.update = async (req, res) => {
  const user = await getUser(req.params.id);
  const params = req.body;

  // validate (if email was changed)
  if (params.username && user.username !== params.username && await User.findOne({ where: { username: params.username } })) {
    res.status(400).json({ message: 'Username "' + params.username + '" is already taken' });
  }

  // validate (if email was changed)
  if (params.email && user.email !== params.email && await User.findOne({ where: { email: params.email } })) {
    res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
  }

  // hash password if it was entered
  if (params.password) {
    params.passwordHash = await hash(params.password);
  }

  let person = await db.person.findByPk(params.person.id);
  /* if (!person) { person = await db.person.create(params.person); return; }
  else {
    Object.assign(person, params.person);
    person.updated = Date.now();
    person = await person.save();
  } */

  if (!person) person = new db.person();
  else
    params.person.updated = new Date(Date.now());

  Object.assign(person, params.person);
  await person.save().then(async p => {
    let address = await db.address.findByPk(params.person.address.id);
    const pAddress = params.person.address;
    pAddress.personId = p.id;
    if (!address) address = new db.address();
    Object.assign(address, pAddress);
    await address.save();

    // copy params to user and save
    Object.assign(user, params);
    user.personId = p.id;
    user.updated = Date.now();
    await user.save()
  })

  return res.status(200).json({ message: "User was updated successfully." });

  /* User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    }); */
};

exports.updateProfile = async (req, res) => {
  const user = await getUser(req.params.id);
  const params = req.body;

  // validate (if email was changed)
  if (params.username && user.username !== params.username && await User.findOne({ where: { username: params.username } })) {
    res.status(400).json({ message: 'Username "' + params.username + '" is already taken' });
  }

  // validate (if email was changed)
  if (params.email && user.email !== params.email && await User.findOne({ where: { email: params.email } })) {
    res.status(400).json({ message: 'Email "' + params.email + '" is already taken' });
  }

  // hash password if it was entered
  if (params.password) {
    params.passwordHash = await hash(params.password);
  }

  let person = await db.person.findByPk(params.person.id);
  /* if (!person) { person = await db.person.create(params.person); return; }
  else {
    Object.assign(person, params.person);
    person.updated = Date.now();
    person = await person.save();
  } */

  if (!person) person = new db.person();
  else
    params.person.updated = new Date(Date.now());

  Object.assign(person, params.person);
  await person.save().then(async p => {
    let address = await db.address.findByPk(params.person.address.id);
    const pAddress = params.person.address;
    pAddress.personId = p.id;
    if (!address) address = new db.address();
    Object.assign(address, pAddress);
    await address.save();

    // copy params to user and save
    Object.assign(user, params);
    user.personId = p.id;
    user.updated = Date.now();
    await user.save()
  })

  return res.status(200).json({ message: "User was updated successfully." });

  /* User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    }); */
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Properties were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all properties."
      });
    });
};

async function getUser(id) {
  // const user = await User.scope('withHash').findOne({ where: { username: params.username }, include: Role });

  const user = await User.findByPk(id, { include: [db.role, db.person] });
  if (!user) res.status(404).json({ message: 'User not found' });
  return user
}

function basicDetails(user) {
  const { id, firstName, lastName, username, email, role, roleId, created, updated, isVerified } = user;
  return { id, firstName, lastName, username, email, role: role.name, roleId, created, updated, isVerified };
}

async function hash(password) {
  // return await bcrypt.hashSync(req.body.password, 10);
  return await bcrypt.hash(password, 10);
}

// find all published User
exports.findAllActive = (req, res) => {
  User.findAll({ where: { status: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving properties."
      });
    });
};