import User from "../DB/models/user_model.js";
import { asyncHandler } from "../Utils/async_handler/asyncHandker.js";
import { readToken } from "../Utils/token/token.js";
const auth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers; //token
  if (!authorization || !authorization.startsWith("Bearer"))
    return next(new Error("Error Token", { cause: 403 }));
  const token = authorization.split(" ")[1]; //bearer <token>
  const decoded = readToken({ token: token });
  const user = await User.findById(decoded.id).select("+password").lean();
  if (!user) return next(new Error("user not found", { cause: 400 }));
  if (user.ChangeAt?.getTime() > decoded.iat * 1000)
    return next(new Error("Token not valid"), { cause: 400 });
  if (user.isDelete == true)
    return next(new Error("please login again"), { cause: 400 });
  req.user = user;
  return next();
});
export default auth;
