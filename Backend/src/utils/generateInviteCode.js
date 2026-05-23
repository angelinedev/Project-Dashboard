const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const DEFAULT_LENGTH = 6;

export const generateInviteCode = (length = DEFAULT_LENGTH) => {
  let code = "";

  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * CHARSET.length);
    code += CHARSET[randomIndex];
  }

  return code;
};
