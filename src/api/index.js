import axios from '@/utlis/axios'
// const host = 'http://13.124.237.200:8031'
const host = 'http://116.85.24.172:8031'

// 发送邮箱验证码
export const sendMail_rent = params => {
  return axios({
    method: 'post',
    url: host + '/binding_email_rent/request_code',
    params
  })
}

// 绑定邮箱
export const bindMail_rent = params => {
  return axios({
    method: 'post',
    url: host + '/binding_email_rent/request_binding',
    params
  })
}

//验证邮箱是否绑定ok
export const binding_is_ok = params => {
  return axios({
    method: 'post',
    url: host + '/binding_email_rent/binding_is_ok',
    params
  })
}

//验证修改邮箱是否绑定ok
export const binding_is_ok_modify = params => {
  return axios({
    method: 'post',
    url: host + '/binding_email_rent/binding_is_ok_modify',
    params
  })
}

// 查询绑定邮箱
export const queryBindMail_rent = params => {
  return axios({
    method: 'post',
    url: host + '/binding_email_rent/query_email',
    params
  })
}

// 修改绑定邮箱
export const modifyBindMail_rent = params => {
  return axios({
    method: 'post',
    url: host + '/binding_email_rent/request_binding_modify',
    params
  })
}

// 修改绑定邮箱验证码
export const modifySendMail_rent = params => {
  return axios({
    method: 'post',
    url: host + '/binding_email_rent/request_code_modify',
    params
  })
}

// 查询机器列表
export const getMcList = params => {
  return axios({
    method: 'post',
    url: host + '/query_all_machines',
    params
  })
}

// 试用-获取创建前的信息
export const try_place_order = params => {
  return axios({
    method: 'post',
    url: host + '/try_rent/place_order',
    params
  })
}

// 获取订单前信息
export const place_order = params => {
  return axios({
    method: 'post',
    url: host + '/rent/place_order',
    params
  })
}

// 创建订单
export const create_order = params => {
  return axios({
    method: 'post',
    url: host + '/rent/create_order',
    params
  })
}

// 支付前信息
export const can_rent_this_machine = params => {
  return axios({
    method: 'post',
    url: host + '/rent/can_rent_this_machine',
    params
  })
}

// 支付后信息
export const pay = params => {
  return axios({
    method: 'post',
    url: host + '/rent/pay',
    params
  })
}

//获取DBC价格
export const get_dbc_price = params => {
  return axios({
    method: 'post',
    url: host + '/rent/get_dbc_price',
    params
  })
}

// 获取计算后DBC的数量
export const get_pay_dbc_count = params => {
  return axios({
    method: 'post',
    url: host + '/rent/get_pay_dbc_count',
    params
  })
}

// 获取我下过订单的机器
export const query_machine_by_wallet = params => {
  return axios({
    method: 'post',
    url: host + '/query_machine_by_wallet',
    params
  })
}

// 获取订单信息
export const get_all_order = params => {
  return axios({
    method: 'post',
    url: host + '/rent/get_all_order',
    params
  })
}

// 获得取消订单的验证码
export const get_cancer_code = params => {
  return axios({
    method: 'post',
    url: host + '/rent/get_cancer_code',
    params
  })
}

// 取消订单
export const cancer_order = params => {
  return axios({
    method: 'post',
    url: host + '/rent/cancer_order',
    params
  })
}

// 获得退租验证码
export const get_stop_code = params => {
  return axios({
    method: 'post',
    url: host + '/rent/get_stop_code',
    params
  })
}

// 退租
export const stop = params => {
  return axios({
    method: 'post',
    url: host + '/rent/stop',
    params
  })
}

// 获取评价接口
export const get_evaluation_code = params => {
  return axios({
    method: 'post',
    url: host + '/rent/get_evaluation_code',
    params
  })
}

// 评价
export const evaluate_machine = params => {
  return axios({
    method: 'post',
    url: host + '/rent/evaluate_machine',
    params
  })
}