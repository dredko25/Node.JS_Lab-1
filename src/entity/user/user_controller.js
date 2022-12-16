const findById = (req, res) =>
  res.json({
    id: Math.floor(Math.random() * 1000),
    username: 'testName',
  })
const createUser = (req, res, url, payload) =>
  res.json({ status: 'ok', ...payload })

export { findById, createUser }
