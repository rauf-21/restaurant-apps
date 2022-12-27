import CONFIG from './config';

type PictureSize = 'small' | 'medium' | 'large';

const RESTAURANT_API_ENDPOINT = {
  LIST: `${CONFIG.BASE_API_URL}/list`,
  DETAIL: (id: string) => `${CONFIG.BASE_API_URL}/detail/${id}`,
  SEARCH: (query: string) => `${CONFIG.BASE_API_URL}/search?q=${query}`,
  REVIEW: `${CONFIG.BASE_API_URL}/review`,
  PICTURE: (pictureId: string, size: PictureSize) =>
    `${CONFIG.BASE_API_URL}/images/${size}/${pictureId}`,
};

export default RESTAURANT_API_ENDPOINT;
