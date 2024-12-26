import 'dotenv/config.js'
import axios from 'axios';

import {
  Contact,
  Message,
  ScanStatus,
  WechatyBuilder,
  log,
} from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'

// 定义接口来描述天行 API 的响应结构
interface TianApiResponse {
  code: number;
  msg: string;
  result: {
    content: string;
  };
}

// 获取天行 API 内容的函数
async function getTianApiContent(): Promise<string | null> {
  try {
    const response = await axios.get<TianApiResponse>('https://apis.tianapi.com/caihongpi/index?key=629005819119c6f1f0221497e28cf9ed');
    const data = response.data;

    if (data && data.code === 200) {
      return data.result.content;
    } else {
      throw new Error(`API error: ${data.msg}`);
    }
  } catch (error) {
    console.error(`Error fetching content from Tian API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

// 捕捉 扫码事件
function onScan(qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')
    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

    qrcodeTerminal.generate(qrcode, {small: true})  // show qrcode on console

  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin(user: Contact) {
  log.info('StarterBot', '%s login', user)
}

function onLogout(user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage(msg: Message) {
  log.info('StarterBot', msg.toString())

  if (msg.text() === 'ding') {
    await msg.say('dong')
  } else if (msg.text() === 'dong') {
    await msg.say('ding')
  } else {
    const content = await getTianApiContent();
    if (content) {
      await msg.say(content);
    } else {
      await msg.say('好热，确定有38.5度');
    }
  }
}


const bot = WechatyBuilder.build({
  name: 'ding-dong-bot',
})

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

// 启动机器人
bot.start()
.then(() => log.info('StarterBot', 'Starter Bot Started.'))
.catch(e => log.error('StarterBot', e))
