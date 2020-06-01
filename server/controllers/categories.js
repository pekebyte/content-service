const Category = require('../models/category')

function getCategoryByPath (req, res, next) {
  Category.findOne({ path: req.params.categoryPath || req.query.category, tenant: req.headers.tenant })
    .then(category => {
      if (!category) {
        return Promise.reject(null)
      }
      req.category = category
      return next()
    })
    .catch(() => {
      res.status(404).json({ message: 'category not exists' }).end()
    })
}

function getCategoriesList (req, res) {
  const query = { tenant: req.headers.tenant }
  if (req.query.target === 'front' || !(req.user && req.user.isEditor)) {
    query.isPublic = true
  }

  Category.find(query)
    .select('-tenant')
    .lean()
    .then(list => {
      res.status(200).json(list || []).end()
    })
    .catch(() => {
      res.status(400).json({ message: 'failed to load categories' }).end()
    })
}

function getCategory (req, res) {
  res.status(200).json(req.category).end()
}

function createCategory (req, res) {
  const body = req.body || {}
  const category = new Category({
    tenant: req.headers.tenant,
    name: body.name,
    path: body.path,
    isPublic: body.isPublic,
  })

  category.save()
    .then(category => {
      if (!category) {
        return Promise.reject(null)
      }
      res.status(200).json(category).end()
    })
    .catch(() => res.status(400).json({ message: 'category creation failed' }).end())
}

function updateCategory (req, res) {
  const body = req.body || {}
  const category = req.category

  if (body.name) {
    category.name = body.name
  }
  if (body.path) {
    category.path = body.path
  }
  if (typeof body.isPublic !== 'undefined') {
    category.isPublic = body.isPublic
  }

  category.save()
    .then(category => {
      res.status(200).json(category).end()
    })
    .catch(() => {
      res.status(400).json({ message: 'category update failed' }).end()
    })
}

function removeCategory (req, res) {
  const category = req.category

  category.remove()
    .then(category => {
      res.status(200).json(category).end()
    })
    .catch(() => {
      res.status(400).json({ message: 'category remove failed' }).end()
    })
}

module.exports = {
  getCategoryByPath,
  getCategoriesList,
  getCategory,
  createCategory,
  updateCategory,
  removeCategory,
}
