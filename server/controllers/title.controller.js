const db = require("../models");
const Title = db.title;
const Op = db.Sequelize.Op;

// Create and Save a new Title
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Title
  const title = {
    name: req.body.name,
    permission: req.body.permission
  };
  // Save Title in the database
  Title.create(title)
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
  
  Title.findAll({ where: condition })
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

// Find a single Title with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Title.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Title with id=" + id
      });
    });
};

// Update a Title by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Title.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Title was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Title with id=${id}. Maybe Title was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Title with id=" + id
      });
    });
};

// Delete a Title with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Title.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Title was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Title with id=${id}. Maybe Title was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Title with id=" + id
      });
    });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
  Title.destroy({
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

// find all published Title
exports.findAllPublished = (req, res) => {
  Title.findAll({ where: { published: true } })
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