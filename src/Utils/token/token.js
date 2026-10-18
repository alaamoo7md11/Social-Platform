import jwt from "jsonwebtoken";
export const createToken = ({
  payload,
  key = process.env.SECRET_JWT,
  options = {},
}) => {
  return jwt.sign(payload, key, options);
};
export const readToken = ({
  token,
  key = process.env.SECRET_JWT,
  options = {},
}) => {
  return jwt.verify(token, key, options);
};
