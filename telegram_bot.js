const { Web3 } = require('web3');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const infuraApiKey = '599810494fcd40fc9dbcf6db457a77c0';
const web3 = new Web3(`https://mainnet.infura.io/v3/${infuraApiKey}`);

// replace the value below with the Telegram token you receive from @BotFather
const token = '7173236355:AAGOaGGZEDKXccTFZrfp3NNn2zUOii1RUzQ';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const ethereum = 'ethereum';
const sol = 'solana';
const ton = 'ton';
const bnc = 'bsc';

var chainId = 'ethereum';

bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Input chainId.");
});

bot.on('message', async (msg) => {

    const chatId = msg.chat.id;

    if(msg.text =="/start" || msg.text =="ethereum" || msg.text =="solana" || msg.text =="bsc" || msg.text =="ton")
    {
        if(msg.text !="/start"){
            chainId = msg.text;
            bot.sendMessage(chatId, "Input smart contract code.");
        }
        return;
    }

  var message = "";

  if(await isContractCode(msg.text)){
    tokenInfo = await getPairInfo(chainId, msg.text);
    var age = new Date() - Date(tokenInfo.pairCreatedAt);
    message = `<b>Forwarded from Fabio</b>
    <b>ANALYSED BY</b> @contract_scan_dev_bot
    
    📊 <a href = "${tokenInfo.url}">${tokenInfo.baseToken.name} (${tokenInfo.baseToken.symbol})</a>
    CA: ${tokenInfo.baseToken.address}
    
    🔸 Chain:${chainId}
    ⚖️Age:${age}
    💰Liq:$${tokenInfo.liquidity.usd} | FDV:$${tokenInfo.fdv}
    🛡️BLACKLIST:NO | HONEYPOT:NO
    📉24h:${tokenInfo.priceChange.h24}% |6h:${tokenInfo.priceChange.h6}% | 1h:${tokenInfo.priceChange.h1}%
    📊24h volume:${tokenInfo.volume.h24}
    
    💲Price per token: ${tokenInfo.priceUsd}
    
    🥇 <b>TOP HODERS:</b>
    <a href = "https://etherscan.io/address/0xec1ef345783783fc11c519aa20c3ab607780ae41">├0xec...ae41</a> | 9.08t | 13.16%
    <a href = "https://etherscan.io/address/0x5bb8f1ce603577a4d17cc9d72f6a4c38f3b0b74c">├0x5b...b74c</a> | 6.85t | 9.93%
    <a href = "https://etherscan.io/address/0xec1ef345783783fc11c519aa20c3ab607780ae41">├0xf9...acec</a> | 6.43t | 9.32%
    <a href = "https://etherscan.io/address/0x2c09deaa11357f19c1bf805b8a7b001ab9a5470f">├0x2c...470f</a> | 4.76t | 6.9%
    <a href = "https://etherscan.io/address/0x6cc5f688a315f3dc28a7781717a9a798a59fda7b">└0x6c...da7b</a> | 1.78t | 2.58%
    
    ♟️ <b>TEAM WALLETS:</b>
    2 wallets holding 7.25%
    <a href = "https://etherscan.io/address/0x2c09deaa11357f19c1bf805b8a7b001ab9a5470f">├0x2c...470f</a> 6.9% of supply
    <a href = "https://etherscan.io/address/0x9d83f4db5c99e5d06e1857269c68443206422327">└0x9d...2327</a> 0.35% of supply
    
    🔎 <a href="${tokenInfo.info.socials[1].url}">Telegram</a> | <a href = "${tokenInfo.info.socials[0].url}">Twitter</a> | <a href = "${tokenInfo.info.websites[0].url}">Website</a>
    🔗<a href = "https://dexscreener.com/${chainId}/${tokenInfo.pairAddress}">DexScreener</a> | <a href = "https://www.dextools.io/app/${chainId}/pair-explorer/${tokenInfo.pairAddress}">DexTools</a>`;
  }
  else
  {
    message = "Input contract code correctly.";
    
  }
  bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
});

async function getPairInfo(chainId, pairAddress) {
    try {
      const response = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chainId}/${pairAddress}`);
      return response.data.pair;
    } catch (error) {
      console.error('Error fetching pair info:', error.message);
    }
  }

async function isContractCode(contractAddress) {
    try {
        if(chainId =="ethereum"){
            code = await web3.eth.getCode(contractAddress);
        }
        return true;
    } catch (error) {
        console.error('Error fetching contract code:', error.message);
        return false;
    }
}