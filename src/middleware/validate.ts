import { NextFunction, Request, Response } from "express";

// const { validationResult } = require("express-validator");
// const { validationResult } from "express-validator";
import validationResult from "express-validator";

const validate = (req: Request, res: Response, next: NextFunction) => {
    
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        message: "Validation failed",
        details: errors.array(),
      },
    });
  }

  next();
};

module.exports = validate;
