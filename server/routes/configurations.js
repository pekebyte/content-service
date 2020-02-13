module.exports = function (app) {
  const populateUser = require('../middleware/populate-user')
  const { onlyAdmin } = require('../middleware/auth-check')

  const {
    getConfigurationsList,
    getConfigurationByKey,
    getConfiguration,
    updateConfiguration
  } = require('../controllers/configurations')

  // configurations routes
  app
    .get('/api/configurations', populateUser, onlyAdmin, getConfigurationsList) // only admin can get ALL menus names
    .get('/api/configurations/:configKey', populateUser, getConfigurationByKey, getConfiguration)
    .put('/api/configurations/:configKey', populateUser, getConfigurationByKey, updateConfiguration)
}
