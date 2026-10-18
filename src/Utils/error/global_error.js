const errorHandler = (error, req, res, next) => {
  const status =
    typeof error.cause === "number" ? error.cause : 500;

  return res.status(status).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
};

export default errorHandler;