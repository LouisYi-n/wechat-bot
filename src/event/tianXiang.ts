import axios from 'axios';

const apiKey = '629005819119c6f1f0221497e28cf9ed';
const apiUrl = 'https://apis.tianapi.com';
const tianXingApi = {
  caiHongPi: '/caihongpi/index',
  tianGou: '/tiangou/index'
};

// 定义接口来描述天行 API 的响应结构
interface TianApiResponse {
  code: number;
  msg: string;
  result: {
    content: string;
  };
}

// 获取天行 API 内容的函数
async function getCaiHongPi(): Promise<string | null> {
  try {
    const response = await axios.get<TianApiResponse>(`${apiUrl}${tianXingApi.caiHongPi}?key=${apiKey}`);
    const data = response.data;

    if (data && data.code === 200) {
      return data.result.content;
    } else {
      throw new Error(`API error: ${data.msg}`);
    }
  } catch (error) {
    console.error(`调用彩虹屁 API 失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return '卡机了，等会再发吧！';
  }
}

 async function getTianGou(): Promise<string | null> {
  try {
    const response = await axios.get<TianApiResponse>(`${apiUrl}${tianXingApi.tianGou}?key=${apiKey}`);
    const data = response.data;

    if (data && data.code === 200) {
      return data.result.content;
    } else {
      if (data?.msg === 'API可用次数不足')
      return '真的一滴也没有了~'
    }
  } catch (error) {
    console.error(`调用舔狗 API 失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  return '卡机了，等会再发吧！';
}

export {getCaiHongPi, getTianGou};


