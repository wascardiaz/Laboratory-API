const db = require("../models");
const UserGroup = db.user_group;
const Op = db.Sequelize.Op;

// Create and Save a new UserGroup
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a UserGroup
  const userGroup = {
    name: req.body.name,
    permission: req.body.permission
  };
  // Save UserGroup in the database
  UserGroup.create(userGroup)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ha ocurrido un error mientras se creaga el Grupo de Usuarios."
      });
    });
};

// Retrieve all Resultados from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  
  UserGroup.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving properties."
      });
    });
};

// Find a single UserGroup with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  UserGroup.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving UserGroup with id=" + id
      });
    });
};

// Update a UserGroup by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  UserGroup.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "UserGroup was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update UserGroup with id=${id}. Maybe UserGroup was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating UserGroup with id=" + id
      });
    });
};

// Delete a UserGroup with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  UserGroup.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "UserGroup was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete UserGroup with id=${id}. Maybe UserGroup was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete UserGroup with id=" + id
      });
    });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
  UserGroup.destroy({
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

// find all published UserGroup
exports.findAllPublished = (req, res) => {
  UserGroup.findAll({ where: { published: true } })
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