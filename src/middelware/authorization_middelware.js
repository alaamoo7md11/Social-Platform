export const isAuthorization = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) //user // admin roles?req.user.roles
      return next(new Error("Not authorization", { cause: 401 }));
    return next();
  };
};
