import schedule from 'node-schedule';
import { getTianGou} from './tianXiang';
import {log} from 'wechaty';

const caiHongPiCron = '0 0/10 * * * *';
const contactName = 'Entr';
const contactName2 = '雨中看海';
// 定时给某人发送彩虹屁消息
export const caiHongPiJob = async (bot: any) => {
  schedule.scheduleJob(caiHongPiCron, async () => {
    // 通过微信号搜索联系人
    try {
      let targetContact;
      const contactList = await bot.Contact.findAll();
      log.info('微信号联系人列表：', contactList)
      for (const contact of contactList) {
        log.info('微信号联系人：', contact)
        log.info('微信号联系人id：', contact.id)
        log.info('微信号联系人name：', contact.name())

        if (contact.name() === contactName2) {
          log.info('找到联系人：', contact)
          targetContact = contact;
        }
      }

      // const contactById = await bot.Contact.find({
      //   id: contactId,
      // })
      // log.info('微信号查找联系人 Entr：', contactById)

      // 向联系人发送消息
      log.info('发送消息给联系人：', targetContact)
      const content = await getTianGou();
      await targetContact.say(content)
    } catch (e) {
      log.error('contactByWeixin', e)
    }
  })
}

