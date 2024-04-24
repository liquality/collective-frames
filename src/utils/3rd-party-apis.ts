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

export const getTokensData = async (tokens: string[]) => {
  const options = {
    method: "GET",
    headers: {
      accept: "*/*",
      "x-api-key": process.env.NEXT_PUBLIC_RESERVOIR_API_KEY || "demo-api-key",
    },
  };
  const tokensUrl = tokens.reduce((acc, current, index) => {
    if (index === 0) {
      return `tokens=${current}%3A1`;
    } else if (index === tokens.length - 1) {
      return `${acc}&tokens=${current}%3A1`;
    }
    return `${acc}&tokens=${current}%3A1`;
  }, "");
  try {
    const response = await fetch(
      `https://api.reservoir.tools/tokens/v7?${tokensUrl}`,
      options
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const { error } = await response.json();
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error("Error Getting the tokens data:", error);
    throw error;
  }
};
