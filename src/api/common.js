import request from '../router/axios';

export const putFile = (file) => {
    const formData = new FormData();
    formData.set('file', file);
    return request({
        url: '/file/put',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
