export const uploadImageToImgBB = async (picture: Blob) => {
  const data = new FormData();
  data.append("image", picture);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: data,
      }
    );

    if (response.ok) {
      const { data } = await response.json();
      return data.url;
    } else {
      const { error } = await response.json();
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error("Error uploading image to ImgBB:", error);
    throw error;
  }
};

export const getTokensOwners = async (tokens: string[]) => {
  const options = {
    method: "GET",
    headers: {
      accept: "*/*",
      "x-api-key": process.env.NEXT_PUBLIC_RESERVOIR_API_KEY || "demo-api-key",
    },
  };
  const baseUrl = "https://api-base.reservoir.tools/owners/v2?token=";

  try {
    const results = await tokens.reduce(async (acc: any, token) => {
      let data = await acc;
      const resp = await fetch(`${baseUrl}${token}%3A1`, options);
      if (resp.ok) {
        data[token] = (await resp.json()).owners;
      }
      return data;
    }, Promise.resolve({}));
    return results;
  } catch (error: any) {
    console.error("Error Getting the tokens data:", error);
    throw error;
  }
};
