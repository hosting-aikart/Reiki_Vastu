export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        // Nested fields are reported as e.g. "customer.address.pincode";
        // for flat forms this is just the field name, as before.
        const fieldName = issue.path.join('.') || 'general';
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }

      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed. Please review your entries.',
          fields: fieldErrors
        }
      });
    }

    req.body = result.data;
    next();
  };
}

export default validate;
