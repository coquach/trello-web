/* eslint-disable no-undef */
let apiRoot = ''

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:3000'
} else if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-b3wg.onrender.com'
}


export const API_ROOT = apiRoot;

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12


export const CARD_MEMBER_ACTION = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}