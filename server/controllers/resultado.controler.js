const db = require("../models");
const Resultado = db.resultado;
const Op = db.Sequelize.Op;

// Create and Save a new Resultado
exports.create = (req, res) => {
  // Validate request
  if (!req.body.resultado_name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Resultado
  const resultado = {
    resultado_name: req.body.resultado_name,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    type: req.body.type,
    minimum_price: req.body.minimum_price,
    maximum_price: req.body.maximum_price,
    ready_to_sell:req.body.ready_to_sell
  };
  // Save Resultado in the database
  Resultado.create(resultado)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Resultado."
      });
    });
};

// Retrieve all Resultados from the database.
exports.findAll = (req, res) => {
  const resultado_name = req.query.resultado_name;
  var condition = resultado_name ? { title: { [Op.like]: `%${resultado_name}%` } } : null;

  Resultado.findAll({ where: condition })
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

// Find a single Resultado with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Resultado.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Resultado with id=" + id
      });
    });
};

// Update a Resultado by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Resultado.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Resultado was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Resultado with id=${id}. Maybe Resultado was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Resultado with id=" + id
      });
    });
};

// Delete a Resultado with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Resultado.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Resultado was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Resultado with id=${id}. Maybe Resultado was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Resultado with id=" + id
      });
    });
};

// Delete all Resultados from the database.
exports.deleteAll = (req, res) => {
  Resultado.destroy({
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

// find all published Resultado
exports.findAllPublished = (req, res) => {
  Resultado.findAll({ where: { published: true } })
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