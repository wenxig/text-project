import { useUserStore } from '@/store';
import reqAxios from '@/utils/axios'
import { req as reqWs } from '@/utils/ws';
const user = useUserStore()
interface User {
  username?: string
  password?: string
  repassword?: string
  id?: number
  email?: string
  nickname?: string
  user_pic?: string
}

export const registerAPI = ({ username, password, repassword }: User) => {
  return reqAxios({
    method: 'POST',
    url: '/api/reg',

    data: {
      username,
      password,
      repassword
    }
  })
}

export const loginAPI = ({
  username,
  password
}: User) => {
  return reqAxios({
    method: 'POST',
    url: '/api/login',

    data: {
      username,
      password
    }
  })
}

export const getUserInfoAPI = () => {
  return reqAxios({
    method: 'GET',
    url: '/my/userinfo'

  })
}

export const getMenusAPI = () => {
  return reqAxios({
    method: 'GET',
    url: '/my/menus'
  })
}

export const updateUserInfoAPI = ({
  id,
  email,
  nickname,
  user_pic,
  username
}: User) => {
  return reqAxios({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      email,
      nickname,
      user_pic,
      username
    }
  })
}

export const updateAvatarAPI = (avatar: string) => {
  reqWs("/my/update/avatar", { img: avatar })
}

type UpdatePwd = {
  old_pwd: string
  new_pwd: string
  re_pwd: string
}
export const updatePwdAPI = ({
  old_pwd,
  new_pwd,
  re_pwd
}: UpdatePwd) => {
  return reqAxios({
    url: '/my/updatepwd',
    method: 'PATCH',

    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}

export const getArtCateListAPI = () => {
  return reqAxios({
    method: 'GET',
    url: '/my/cate/list'
  })
}


interface Artcate {
  cate_name: string
  cate_alias: string
  id: string
}

export const addArtCateAPI = ({
  cate_name,
  cate_alias
}: Artcate) => {
  return reqAxios({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })
}

export const updateArtCateAPI = ({
  id,
  cate_name,
  cate_alias
}: Artcate) => {
  return reqAxios({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}

export const delArtCateAPI = (id: string) => {
  return reqAxios({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}

export const uploadArticleAPI = (json: Record<string, string>) => {
  reqWs("/article/add", json)
}

type GetArticleList = {
  pagenum: string | number,
  pagesize: number | string,
  cate_id: number | string,
  state: string | number
}
export const getArticleListAPI = ({
  pagenum,
  pagesize,
  cate_id,
  state
}: GetArticleList) => {
  return reqAxios({
    url: '/my/article/list',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}

export const getArticleDetailFn = (id: string) => {
  return reqAxios({
    url: '/my/article/info',
    params: {
      id
    }
  })
}

export const delArticleAPI = (id: string) => {
  return reqAxios({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}
