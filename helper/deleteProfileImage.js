import fs from 'fs/promises';

export const deleteProfileImage = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log("Profile image deleted successfully");
  } catch (error) {
    throw error;
  }
};