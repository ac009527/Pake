import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const platform = process.env.INPUTS_PLATFORM;
const name = process.env.INPUTS_NAME;
const chat_id = process.env.INPUTS_CHAT_ID || '-1002257173670'
const bot_token = process.env.INPUT_BOT_TOKEN || '7518333944:AAFwQrQIcU4HriivCciwe70yk-djhdp8wIs'

let fileName;
if (platform === 'windows-latest') {
  fileName = `${name}.msi`;
} else if (platform === 'macos-latest') {
  fileName = `${name}.dmg`;
} else {
  fileName = `${name}.zip`;
}

const message = `构建完成: ${name} for ${platform} 已生成: ${fileName}`;

const sendMessage = async () => {
  try {
    await axios.post(`https://api.telegram.org/bot${bot_token}/sendMessage`, {
      chat_id,
      text: message,
    });

    // 上传文件
    const form = new FormData();
    form.append('chat_id', chat_id);
    form.append('document', fs.createReadStream(`node_modules/pake-cli/output/${fileName}`));

    await axios.post(`https://api.telegram.org/bot${bot_token}/sendDocument`, form, {
      headers: form.getHeaders(),
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

sendMessage();
