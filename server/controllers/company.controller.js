const db = require("../models");
const Company = db.company;
const Op = db.Sequelize.Op;

// Create and Save a new Company
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Company
  const setting = {
    username: req.body.username,
    email: req.body.email,
    user_group_id: parseInt(req.body.userGroupId, 10),
    password: bcrypt.hashSync(req.body.password, 10),
    status: req.body.status ? '1' : '0'
  };
  // Save Company in the database
  Company.create(setting)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Company."
      });
    });
};

// Retrieve all Resultados from the database.
exports.findAll = (req, res) => {
  const code = req.query.code;
  var condition = code ? { code: { [Op.like]: `%${code}%` } } : null;

  Company.findAll({ where: condition })
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Se produjo un error al recuperar las propiedades."
      });
    });
};

// Retrieve all Resultados from the database.
exports.findAndCountAll = async (req, res) => {
  const options = req.query;
  var condition = null;
  if (options.search && options.origin)
    condition = { id: { [Op.like]: `%${options.search}%` }, origenId: options.origin };
  else if (options.search)
    condition = { id: { [Op.like]: `%${options.search}%` } };
  else if (options.origin)
    condition = { origenId: options.origin }
  await Company.findAndCountAll({
    where: condition,
    include: { all: true, nested: true },
    order: options.orderBy && options.orderDir ? [[options.orderBy, options.orderDir]] : [['id', 'DESC']],
    offset: options.page ? parseInt(options.page) * options.size : 1,
    limit: options.size ? parseInt(options.size) : 5,
  }).then(data => {
    res.status(200).json({ count: data.count, records: data.rows });
  }).catch(err => {
    console.log(err);
    throw err.message || "Se produjo un error al recuperar las propiedades.";
  });
};

// Find a single Company with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Company.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error recuperando Empresa con id=" + id
      });
    });
};

// Update a Company by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Company.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "La Empresa fue actualizada correctamente."
        });
      } else {
        res.send({
          message: `Cannot update Company with id=${id}. Maybe Company was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error actualizando la Empresa con id=" + id
      });
    });
};

// Delete a Company with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Company.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Company was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Company with id=${id}. Maybe Company was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Company with id=" + id
      });
    });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
  Company.destroy({
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

// find all published Company
exports.findAllActive = (req, res) => {
  Company.findAll({ where: { status: true } })
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