import axios from 'axios';
import {OnlineRoot, RootPath, Source} from './Config';

// const Get = (path, root, token = null) => {
//   // console.log('root path',RootPath);

//   const promise = new Promise((resolve, reject) => {

//     axios
//       .get(`${root ? OnlineRoot : RootPath}${path}`, {
//         headers: {
//           cancelToken: Source.token,
//           Authorization: token == null ? null : `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       })
//       .then(
//         response => {
//           // Resolve dengan data dari respons
//           resolve(response.data);
//         },
//         err => {
//           reject(err);
//         },
//       );
//   });
//   return promise;
// };

const Get = async (path, root = false, token = null) => {
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
      const response = await axios.get(
        `${root ? OnlineRoot : RootPath}${path}`,
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
            Accept: 'application/json',
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
          const newResponse = await axios.get(
            `${root ? OnlineRoot : RootPath}${path}`,
            {
              headers: {
                cancelToken: Source.token,
                Authorization: `Bearer ${newToken}`,
                Accept: 'application/json',
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

export default Get;
