exports.notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
};

exports.errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
};