export async function isSigned({ bearer, jwt, set }: any) {
  if (!bearer) {
    set.status = 401;
    return "Unauthorized";
  }

  const profile = await jwt.verify(bearer);

  if (!profile) {
    set.status = 401;
    return "token not valid";
  }
}
