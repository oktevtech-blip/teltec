function sendDbError(res, context, err) {
  console.error(context, err);

  return res.status(500).json({
    success: false,
    error: "Database error",
    details: err?.message || err,
  });
}

module.exports = sendDbError;