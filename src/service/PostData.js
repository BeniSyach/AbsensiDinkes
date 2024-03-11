import axios from 'axios';
import {OnlineRoot, RootPath} from './Config';

const PostData = async (path, root = false, data, token = null) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const refreshResponse = await axios.get(
        `${root ? OnlineRoot : RootPath}auth/token`,
        {
          headers: {
            Cookie: `refreshToken=${token}`,
          },
        },
      );
      const newToken = refreshResponse.data.akses_token;

      const response = await axios.post(
        `${root ? OnlineRoot : RootPath}${path}`,
        data,
        {
          headers: {
            Authorization: token == null ? null : `Bearer ${newToken}`,
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':
              'POST, GET, PUT,PATCH,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            // 'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
          },
        },
      );

      // Resolve dengan data dari respons
      resolve(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        // Tangani pembatalan permintaan
        console.log('Request canceled', error.message);
        reject(error);
      } else if (error.response && error.response.status === 401) {
        // Token kedaluwarsa, lakukan refresh token
        try {
          const refreshResponse = await axios.get(
            `${root ? OnlineRoot : RootPath}auth/token`,
            {
              headers: {
                Cookie: `refreshToken=${token}`,
              },
            },
          );
          const newToken = refreshResponse.data.akses_token;

          // Lakukan sesuatu dengan token baru jika diperlukan
          console.log('New Token:', newToken);

          // Perbarui header Authorization dengan token baru
          Source.token = axios.CancelToken.source();
          const newResponse = await axios.post(
            `${root ? OnlineRoot : RootPath}${path}`,
            data,
            {
              headers: {
                Authorization: token == null ? null : `Bearer ${newToken}`,
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods':
                  'POST, GET, PUT,PATCH,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                // 'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
              },
            },
          );

          // Resolve dengan data dari respons baru
          resolve(newResponse.data);
        } catch (refreshError) {
          // Tangani kesalahan refresh token
          console.log('Error refreshing token:', refreshError.message);
          reject(refreshError);
        }
      } else {
        // Tangani kesalahan lainnya
        console.log('Error:', error.message);
        reject(error);
      }
    }
  });

  return promise;
};

export default PostData;
