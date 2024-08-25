module.exports = (req, res) => {
    console.log('Hello function called');
    res.status(200).json({ message: 'Hello from serverless function!' });
  };