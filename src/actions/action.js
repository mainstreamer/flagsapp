import * as constants from 'constants/auth';

import Cookies from 'js-cookie';

export const initialAction = () => (dispatch, getState, { api }) => {
    // const cookies = Cookies.getJSON('auth')
    // api.setAuthorization(window.token);
    dispatch({
        type: 'initial',
        // payload: {
        //     access: window.token,
        // },
    });
    // }
};

// export const fetchList = ({ page = 0, perpage = 10, status, search, sort, direction }) => async (
//   dispatch,
//   _,
//   { api, schemas, normalize },
// ) => {
//   dispatch({ type: constants.LIST_LOAD_START });
//   try {
//     const res = await api.get('/api/profile', { params: { page, perpage, status, search, sort, direction } });
//     // const res = await api.get('/cars');
//
//     const payload = {
//       ...res.data,
//       perpage,
//       // ...normalize(res.data.items, [schemas.user]),
//     };
//
//     dispatch({
//       type: constants.LIST_LOAD_SUCCESS,
//       payload,
//     });
//   } catch (e) {
//     console.error(e);
//     dispatch({ type: constants.LIST_LOAD_FAILED });
//   }
// };
//
// export const fetchSingle = id => async (dispatch, _, { api, schemas, normalize }) => {
//   dispatch({ type: constants.LOAD_START });
//
//   try {
//     // const res = await api.get(`/api/${id}/`);
//     const res = await api.get(`/api/profile`);
//
//     dispatch({
//       type: constants.LOAD_SUCCESS,
//       payload: normalize(res.data, schemas.user),
//     });
//   } catch (e) {
//     console.error(e);
//     dispatch({ type: constants.LOAD_FAILED });
//   }
// };
//
// export const fetchNotifications = ({ id, page = 0, perpage = 10 }) => async (dispatch, _, { api }) => {
//   dispatch({ type: constants.NOTIFICATIONS_LOAD_START });
//   try {
//     const res = await api.get(`users/${id}/notifications`, {
//       params: { page, perpage },
//     });
//
//     dispatch({
//       type: constants.NOTIFICATIONS_LOAD_SUCCESS,
//       payload: {
//         data: res.data.items,
//         count: res.data.count,
//         perpage,
//       },
//     });
//   } catch (e) {
//     console.error(e);
//     dispatch({ type: constants.NOTIFICATIONS_LOAD_FAILED });
//   }
// };
//
// export const createEntity = (user, actions) => async (dispatch, getState, { api }) => {
//   actions.setSubmitting(true);
//
//   const { firstName, lastName, role, email, phone } = user;
//   try {
//     const res = await api.post(`/users`, {
//       firstName,
//       lastName,
//       role,
//       email,
//       phone,
//     });
//
//     if (res.status !== 200) throw new Error(res.statusText);
//
//     dispatch({
//       type: constants.ADD_ENTITY_SUCCESS,
//       user,
//     });
//     actions.setSubmitting(false);
//     actions.resetForm();
//     return true;
//   } catch (e) {
//     console.error(e);
//     actions.setSubmitting(false);
//     dispatch({ type: constants.ADD_ENTITY_FAILED, payload: e.response && e.response.data });
//     return false;
//   }
// };
//
// export const createCompanyUser = (user, actions) => async (dispatch, getState, { api }) => {
//   actions.setSubmitting(true);
//
//   const { firstName, lastName, role, email, phone, company } = user;
//   try {
//     const res = await api.post(`/users`, {
//       firstName,
//       lastName,
//       role,
//       email,
//       phone,
//       company,
//     });
//
//     if (res.status !== 200) throw new Error(res.statusText);
//
//     dispatch({
//       type: constants.ADD_ENTITY_SUCCESS,
//       user,
//     });
//     actions.setSubmitting(false);
//     actions.resetForm();
//     return true;
//   } catch (e) {
//     console.error(e);
//     actions.setSubmitting(false);
//     dispatch({ type: constants.ADD_ENTITY_FAILED, payload: e.response && e.response.data });
//     return false;
//   }
// };
//
// export const fetchRoles = () => async (dispatch, _, { api }) => {
//   dispatch({ type: constants.ROLES_LOAD_START });
//   try {
//     const res = await api.get('/users/roles');
//
//     dispatch({
//       type: constants.ROLES_LOAD_SUCCESS,
//       payload: res.data,
//     });
//   } catch (e) {
//     console.error(e);
//     dispatch({ type: constants.ROLES_LOAD_FAILED });
//   }
// };
//
// export const deleteUser = userId => async (dispatch, getState, { api }) => {
//   try {
//     const res = await api.delete(`/users/${userId}`);
//
//     if (res.status !== 200) throw new Error(res.statusText);
//
//     dispatch({
//       type: constants.DELETE_SUCCESS,
//       userId,
//     });
//   } catch (e) {
//     console.error(e);
//     dispatch({ type: constants.DELETE_USER_FAILED });
//   }
// };
//
// export const entityHandler = (user, actions) => async (dispatch, getState, { api }) => {
//   actions.setSubmitting(true);
//   try {
//     const { id, firstName, lastName, role, email, phone, image, company } = user;
//
//     const res = await api.put(`/users/${id}`, {
//       firstName,
//       lastName,
//       role,
//       email,
//       phone,
//       company,
//     });
//
//     if (image instanceof File) {
//       const previewFile = new FormData();
//       previewFile.append('image', image);
//       await api.post(`/users/${id}/image`, previewFile);
//     }
//
//     if (res.status !== 200) throw new Error(res.statusText);
//
//     dispatch({
//       type: constants.UPDATE_ENTITY_SUCCESS,
//       userResource: user,
//     });
//
//     actions.setSubmitting(false);
//     actions.resetForm();
//     return true;
//   } catch (e) {
//     console.error(e);
//
//     actions.setSubmitting(false);
//     dispatch({ type: constants.UPDATE_ENTITY_FAILED, payload: e.response && e.response.data });
//     return false;
//   }
// };
//
// export const clearItems = () => ({
//   type: constants.CLEAR_ITEMS,
// });
//
export const ska = () => ({
  type: 'ska'
});

export const fetchProfile = () => async (dispatch, _, { api }) => {
    dispatch({ type: constants.PROFILE_LOAD_START });
    try {
        console.log('LOLOLO');
        const res = await api.get('/profile');
        dispatch({
            type: constants.PROFILE_LOAD_SUCCESS,
            payload: res.data,
        });
    } catch (e) {
        console.error(e);
        dispatch({ type: constants.PROFILE_LOAD_FAILED });
    }
};
