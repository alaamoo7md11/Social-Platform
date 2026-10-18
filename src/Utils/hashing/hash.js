import bcrypt from "bcrypt";
export const hash = ({
  plantxt,
  rounds = Number(process.env.HASHING_PASSWORD),
}) => {
 
  return bcrypt.hashSync(plantxt, rounds);
};
export const compare = ({ plantxt, hash }) => {
  return bcrypt.compareSync(plantxt, hash);
};
