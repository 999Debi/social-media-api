const notFoundMiddleware = (req, res) => {
  res.status(404).send("Route Does Not ");
};
export default notFoundMiddleware;
