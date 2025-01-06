import {Contact, Message, ScanStatus, WechatyBuilder, log,} from 'wechaty'
import qrcodeTerminal from 'qrcode-terminal'
import * as fs from 'fs';
import {getCaiHongPi, getTianGou} from './event/tianXiang';
import {caiHongPiJob} from './event/scheduleEvent';

function onScan(qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    // 将url 写入 ./wechatLoginEnv.sh 文件
    const url = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`;
    const scriptContent = `export LOGIN_URL=${url}\n`;
    fs.writeFileSync('./wechatLoginEnv.sh', scriptContent);
    log.info(`扫描二维码登录: ${status}\n${url}`);

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
  log.info('登录：', '%s login', user)
  caiHongPiJob(bot);
}

function onLogout(user: Contact) {
  log.info('登出：', '%s logout', user)
}

async function onMessage(msg: Message) {
  log.info('收到消息：', msg.toString())
  const messageAgeInSeconds  = msg.age()
  log.info('消息延迟时常(秒)：', messageAgeInSeconds)
  const messageAgeInMinutes  = messageAgeInSeconds / 60;
  log.info('消息延迟时常(分钟)：', messageAgeInMinutes)
  const isSelf = msg.self()
  log.info('消息是否自己发出：', isSelf)
  if (isSelf || messageAgeInMinutes > 2) {
    log.info('消息延迟超过2分钟或者自己发出，不处理')
    return
  }
  if (msg.text() === 'ding') {
    await msg.say('dong')
  } else if (msg.text() === 'dong') {
    await msg.say('ding')
  } else {
    const content = await getTianGou();
    log.info('获取舔狗API 内容为：', content)
    if (content) {
      await msg.say(content);
    } else {
      await msg.say('好热，确定有38.5度');
    }
  }
}

// 实例化一个 bot 对象
const bot = WechatyBuilder.build({
//  puppet: 'wechaty-puppet-wechat4u',
  puppet: 'wechaty-puppet-wechat',
  puppetOptions: {
    uos: true
  },
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
