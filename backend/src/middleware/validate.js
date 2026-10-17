export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] || 'general';
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
