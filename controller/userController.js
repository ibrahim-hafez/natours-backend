
exports.getAllUsers = (req, res) => {
  res.status(200).send({ status: 'success' })
}

exports.addUser = (req, res) => {
  res.status(201).json({
    status: 'success',
  })
}

exports.getUser = (req, res) => {
  res.status(200).json({ status: 'success', })
}

exports.deleteUser = (req, res) => {
  res.status(204).json({ status: 'success', data: null })
}
