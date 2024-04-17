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
            console.log("data for upload!!");
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