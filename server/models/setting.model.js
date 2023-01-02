const { gzipSync, gunzipSync } = require("zlib");

module.exports = (sequelize, Sequelize) => {
  const attributes = {
    /* setting_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        }, */
    companyId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    code: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    key: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    value: {
      type: Sequelize.TEXT,
      // get() {
      //     const storedValue = this.getDataValue('value');
      //     const gzippedBuffer = Buffer.from(storedValue, 'base64');
      //     const unzippedBuffer = gunzipSync(gzippedBuffer);
      //     return unzippedBuffer.toString();
      // },
      // set(value) {
      //     const gzippedBuffer = gzipSync(value);
      //     this.setDataValue('value', gzippedBuffer.toString('base64'));
      // },
      allowNull: false,
    },
    serialized: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
  };
  const options = {
    timestamps: false,
  };

  const Setting = sequelize.define("setting", attributes, options);

  Setting.removeAttribute("id");

  Setting.associate = function (models) {
    /* Setting.belongsTo(models.company, {
            foreignKey: 'companyId', targetKey: 'id'
        }); */
  };

  return Setting;
};
