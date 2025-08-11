/* eslint-disable no-undef */
let apiRoot = ''

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:3000'
} else if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-web-ten-nu.vercel.app'
}


export const API_ROOT = apiRoot;