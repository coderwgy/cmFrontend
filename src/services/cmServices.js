import { stringify } from 'qs';
import request from '@/utils/request';

////////////////////product//////////////////
export async function getAllProducts() {
  return request('/cm/v1/products');
}

export async function deleteProduct(params) {
  return request(`/cm/v1/products/${params.id}`, {
    method: 'DELETE',
  });
}

export async function addProduct(params) {
  return request(`/cm/v1/products`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateProduct(params) {
  return request(`/cm/v1/products/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

////////////////////column//////////////////

export async function getColumnsByProduct(params) {
  return request(`/cm/v1/products/${params.productId}/columns`);
}

export async function deleteColumn(params) {
  return request(`/cm/v1/products/${params.productId}/columns/${params.columnId}`, {
    method: 'DELETE',
  });
}

export async function addColumn(params) {
  const formData = transToFormData(params);
  return request(`/cm/v1/products/${params.productId}/columns`, {
    method: 'POST',
    body: formData,
  });
}

export async function updateColumn(params) {
  const formData = transToFormData(params);
  return request(`/cm/v1/products/${params.productId}/columns/${params.columnId}`, {
    method: 'PUT',
    body: formData,
  });
}

/////////////////content/////////////////

export async function getContentsByProduct(params) {
  return request(`/cm/v1/products/${params.productId}/contents`);
}

export async function deleteContent(params) {
  return request(`/cm/v1/products/${params.productId}/contents/${params.contentId}`, {
    method: 'DELETE',
  });
}

export async function addContent(params) {
  const formData = transToFormData(params);
  return request(`/cm/v1/products/${params.productId}/contents`, {
    method: 'POST',
    body: formData,
  });
}

export async function updateContent(params) {
  const formData = transToFormData(params);
  return request(`/cm/v1/products/${params.productId}/contents/${params.contentId}`, {
    method: 'PUT',
    body: formData,
  });
}
//////////////////relation//////////////////
export async function getColumnDetail(params) {
  return request(`/cm/v1/products/${params.productId}/columns/${params.columnId}/contents?detail`);
}


export async function deleteRelation(params) {
  return request(`/cm/v1/products/${params.productId}/columns/${params.columnId}/contents/${params.contentId}?type=${params.type}`, {
    method: 'DELETE',
  });
}

export async function addRelation(params) {
  return request(`/cm/v1/products/${params.productId}/columns/${params.columnId}/contents`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateRelation(params) {
  return request(`/cm/v1/products/${params.productId}/columns/${params.columnId}/contents/${params.contentId}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

/////////////////ftp////////////////
export async function getFtpConfig() {
  return request('/cm/v1/ftps/1');
}
export async function updateFtpConfig(params) {
  return request('/cm/v1/ftps/1', {
    method: 'PUT',
    body: {
      ...params,
      id:1,
    },
  });
}

////////////////////utilFunction///////////////
const transToFormData = (params) => {
  var data = new FormData();
  for(let key in params){
    data.append(key,params[key]);
  }
  console.log(data instanceof FormData);
  return data;
}