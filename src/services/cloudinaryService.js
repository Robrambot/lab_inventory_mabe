const CLOUD_NAME = 'dq9bdcdpw';
const UPLOAD_PRESET = 'prestamos-app';

export const uploadToCloudinary = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir la imagen a Cloudinary.');
    }

    const data = await response.json();
    return data.secure_url;

  } catch (e) {
    console.error(e);
    throw e; // Re-lanzamos el error para que el componente que llama pueda manejarlo
  }
}
