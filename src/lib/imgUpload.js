export const imageUpload = async (imageFile) => {
  if (!imageFile) return null;

  const formData = new FormData();
  formData.append('image', imageFile);

  const IMGBBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY;

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBBB_API_KEY}`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (data.success) {
    return data.data.url; 
  } else {
    throw new Error("Image host upload failed. Check ImgBB Key.");
  }
};