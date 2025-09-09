/**
 * 悬浮在网页上的挂件
 */
module.exports = {
  THEME_SWITCH: process.env.NEXT_PUBLIC_THEME_SWITCH || false, // 是否显示切换主题按钮
  // Chatbase 是否显示chatbase机器人 https://www.chatbase.co/
  CHATBASE_ID: process.env.NEXT_PUBLIC_CHATBASE_ID || null,
  // WebwhizAI 机器人 @see https://github.com/webwhiz-ai/webwhiz
  WEB_WHIZ_ENABLED: process.env.NEXT_PUBLIC_WEB_WHIZ_ENABLED || false, // 是否显示
  WEB_WHIZ_BASE_URL:
    process.env.NEXT_PUBLIC_WEB_WHIZ_BASE_URL || 'https://api.webwhiz.ai', // 可以自建服务器
  WEB_WHIZ_CHAT_BOT_ID: process.env.NEXT_PUBLIC_WEB_WHIZ_CHAT_BOT_ID || null, // 在后台获取ID
  DIFY_CHATBOT_ENABLED: process.env.NEXT_PUBLIC_DIFY_CHATBOT_ENABLED || false,
  DIFY_CHATBOT_BASE_URL: process.env.NEXT_PUBLIC_DIFY_CHATBOT_BASE_URL || '',
  DIFY_CHATBOT_TOKEN: process.env.NEXT_PUBLIC_DIFY_CHATBOT_TOKEN || '',

  // 悬浮挂件
  WIDGET_PET: process.env.NEXT_PUBLIC_WIDGET_PET || true, // 是否显示宠物挂件
  WIDGET_PET_LINK:
    process.env.NEXT_PUBLIC_WIDGET_PET_LINK ||
    'https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json', // 挂件模型地址 @see https://github.com/xiazeyu/live2d-widget-models
  WIDGET_PET_SWITCH_THEME:
    process.env.NEXT_PUBLIC_WIDGET_PET_SWITCH_THEME || true, // 点击宠物挂件切换博客主题

  SPOILER_TEXT_TAG: process.env.NEXT_PUBLIC_SPOILER_TEXT_TAG || '', // Spoiler文本隐藏功能，如Notion中 [sp]希望被spoiler的文字[sp]，填入[sp] 即可

  // 音乐播放插件
  MUSIC_PLAYER: process.env.NEXT_PUBLIC_MUSIC_PLAYER || false, // 是否使用音乐播放插件
  MUSIC_PLAYER_VISIBLE: process.env.NEXT_PUBLIC_MUSIC_PLAYER_VISIBLE || true, // 是否在左下角显示播放和切换，如果使用播放器，打开自动播放再隐藏，就会以类似背景音乐的方式播放，无法取消和暂停
  MUSIC_PLAYER_AUTO_PLAY:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_AUTO_PLAY || true, // 是否自动播放，不过自动播放时常不生效（移动设备不支持自动播放）
  MUSIC_PLAYER_LRC_TYPE: process.env.NEXT_PUBLIC_MUSIC_PLAYER_LRC_TYPE || '1', // 歌词显示类型，可选值： 3 | 1 | 0（0：禁用 lrc 歌词，1：lrc 格式的字符串，3：lrc 文件 url）（前提是有配置歌词路径，对 meting 无效）
  MUSIC_PLAYER_CDN_URL:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_CDN_URL ||
    'https://cdn.jsdelivr.net/npm/aplayer@1.10.0/dist/APlayer.min.js',
  MUSIC_PLAYER_ORDER: process.env.NEXT_PUBLIC_MUSIC_PLAYER_ORDER || 'list', // 默认播放方式，顺序 list，随机 random
  MUSIC_PLAYER_AUDIO_LIST: [
    // 示例音乐列表。除了以下配置外，还可配置歌词，具体配置项看此文档 https://aplayer.js.org/#/zh-Hans/
    {
      name: 'OAOA (现在就是永远)',
      artist: '五月天',
      url: 'https://dlink.host/1drv/aHR0cHM6Ly8xZHJ2Lm1zL3UvYy8zMTRmZDMzNjY5NjllMzZmL0VVcnFxcEppTVNsR3BJMjczNWlOLXV3Qm9Vd2xTZHFKeU9FeS1WZDBKWDRrUWc_ZT11Z2o0aEY.mp3',
      cover:
        'http://p1.music.126.net/5Bu3XLAvh-M9Iwkh0wlOYg==/109951168162347102.jpg',
      lrc:'[00:00.00] 作词 : 五月天 阿信\n[00:01.00] 作曲 : 五月天 阿信\n[00:02.00] 编曲 : 五月天\n[00:20.70]我相信苦涩的眼泪\n[00:23.94]我不信甜美的誓言\n[00:27.30]我相信音乐就该音乐\n[00:33.90]我相信爱情的纯粹\n[00:37.20]我不信华丽的诗篇\n[00:40.47]我相信热烈的争辩\n[00:43.77]我不信无声的和谐\n[00:47.10]我相信秒秒的瞬间\n[00:50.43]我不信年年的永远\n[00:53.73]我相信摇滚就能万岁\n[00:58.77]快张开你的嘴 OA OA\n[01:00.27]再不管你是谁 OA OA\n[01:04.08]人生都太短暂\n[01:07.02]别想别怕别后退\n[01:09.57]现在就是永远\n[01:11.94]出生的那一年 OA OA\n[01:15.39]转眼就这一天 OA OA\n[01:17.13]人生都太短暂\n[01:20.13]去疯去爱去浪费\n[01:22.86]和我再唱 OA OAOA\n[01:24.15]我相信苦涩的眼泪\n[01:36.75]我不信甜美的誓言\n[01:40.02]我相信音乐就该音乐\n[01:46.71]我相信爱情的纯粹\n[01:50.01]我不信华丽的诗篇\n[01:53.31]我相信热烈的争辩\n[01:56.61]我不信无声的和谐\n[01:59.91]我相信秒秒的瞬间\n[02:03.27]我不信年年的永远\n[02:06.57]我相信摇滚就能万岁\n[02:11.64]快张开你的嘴 OA OA\n[02:13.41]再不管你是谁 OA OA\n[02:16.35]人生都太短暂\n[02:19.86]别想别怕别后退\n[02:22.38]现在就是永远\n[02:24.75]出生的那一年 OA OA\n[02:26.58]转眼就这一天 OA OA\n[02:31.23]人生都太短暂\n[02:33.00]去疯去爱去浪费\n[02:35.64]和我再唱 OA OAOA\n[02:37.11]我相信秒秒的瞬间\n[03:11.13]我不信年年的永远\n[03:14.52]我相信摇滚就能万岁\n[03:19.53]快张开你的嘴 OA OA\n[03:21.30]再不管你是谁 OA OA\n[03:24.72]人生都太短暂\n[03:27.75]别想别怕别后退\n[03:30.27]现在就是永远\n[03:32.61]出生的那一年 OA OA\n[03:34.41]转眼就这一天 OA OA\n[03:37.74]人生都太短暂\n[03:40.86]去疯去爱去浪费\n[03:43.50]和我再唱 OA OAOA\n[04:37.45] Midi program:阿信+怪兽+阿璞(八三夭)\n[04:38.45] 弦乐编写:李琪+阿信\n[04:39.45] 弦乐演奏:李琪北京室内乐团\n[04:40.45] 和声演唱:阿璞(八三夭)+士杰+可乐 Cola Kai\n'
    },
    {
      name: '笑忘歌',
      artist: '五月天',
      url: 'https://dlink.host/1drv/aHR0cHM6Ly8xZHJ2Lm1zL3UvYy8zMTRmZDMzNjY5NjllMzZmL0VRVlhvV3N1cTF0RmlodkVUbHNORmpRQmVmWFNqNGtxSE9PYXY1MHIyMmFrWHc_ZT1zVHZPNUI.mp3',
      cover:
        'http://p2.music.126.net/l0vGEnowGfj6DgFSGojyfQ==/109951168163397768.jpg',
      lrc:'[00:00.00] 作词 : 五月天 阿信
[00:01.00] 作曲 : 五月天 怪兽
[00:02.00] 编曲 : 五月天
[00:08.85]屋顶的天空是我们的
[00:12.84]放学后夕阳也都会是我们的
[00:17.34]不会再让步更多了
[00:24.90]唱一首属于我们的歌
[00:28.86]让我们的伤都慢慢慢的愈合
[00:32.79]明天我又会是全新的
[00:39.00] OH HO
[00:39.36]青春是手牵手坐上了
[00:43.62]永不回头的火车
[00:47.37]总有一天我们都老了
[00:51.63]不会遗憾就 OK了
[00:55.02]伤心的都忘记了
[00:59.37]只记得这首笑忘歌
[01:03.36]那一年天空很高风很清澈
[01:07.62]从头到脚趾都快乐
[01:11.10]我和你都约好了
[01:15.36]要再唱这首笑忘歌
[01:19.35]这一生志愿只要平凡快乐
[01:23.46]谁说这样不伟大呢
[01:30.84]自己和自己打一架了
[01:34.71]想通想不通反正就是这样了
[01:39.33]不会再流泪更多了
[01:46.83]有多少错误重蹈覆辙
[01:50.82]有多少苦痛还不是都过来了
[01:54.72]想起来甚至还会笑呢
[02:00.90] OH HO
[02:01.32]青春是人生的实验课
[02:05.64]错也错得很值得
[02:09.30]就算某天唱起这首歌
[02:13.56]眼眶会有一点湿热
[02:16.95]伤心的都忘记了
[02:21.39]只记得这首笑忘歌
[02:25.32]那一年天空很高风很清澈
[02:29.64]从头到脚趾都快乐
[02:33.12]我和你都约好了
[02:37.38]要再唱这首笑忘歌
[02:41.34]这一生志愿只要平凡快乐
[02:45.51]谁说这样不伟大呢
[03:12.96]伤心的都忘记了
[03:17.37]只记得这首笑忘歌
[03:21.33]那一年天空很高风很清澈
[03:25.62]从头到脚趾都快乐
[03:29.16]我和你都约好了
[03:33.33]要再唱这首笑忘歌
[03:37.35]这一生志愿只要平凡快乐
[03:41.55]谁说这样不伟大呢
[03:45.42]这一生志愿只要平凡快乐
[03:49.56]谁说这样不伟大呢
[03:53.49]谁说这样不伟大呢'
    },
  {
      name: '后青春期的诗',
      artist: '五月天',
      url: 'https://dlink.host/1drv/aHR0cHM6Ly8xZHJ2Lm1zL3UvYy8zMTRmZDMzNjY5NjllMzZmL0VkUHNRTVdXejlwQ3JvaGdRbnRmaThZQkJHMEQ2dUlGckZoYW85LVVtUmRjOWc_ZT1ybE9welU.mp3',
      cover:
        'http://p2.music.126.net/l0vGEnowGfj6DgFSGojyfQ==/109951168163397768.jpg',
    lrc:'[00:00.000] 作词 : 五月天 阿信\n[00:00.175] 作曲 : 五月天 阿信\n[00:00.350]编曲：五月天\n[00:00.450]制作编曲演奏：五月天\n[00:00.550]Midi Program: 阿信+怪兽+石头\n[00:00.650]古典吉他：怪兽\n[00:00.750]E Bow：怪兽\n[00:00.850]Double Bass: 玛莎\n[00:00.950]口琴：玛莎\n[00:01.050]和声编写：玛莎\n[00:01.150]和声演唱：士杰\n[00:01.250]OP：认真工作室\n[00:01.350]SP：相信音乐国际股份有限公司\n[00:01.450]ISRC TW-K23-08-016-11\n[00:01.850]当烟雾随晨光飘散\n[00:08.670]枕畔的湖已风干\n[00:12.350]期待已退化成等待\n[00:17.400]而我告别了突然\n[00:24.600]当泪痕勾勒成遗憾\n[00:30.870]回忆夸饰着伤感\n[00:34.500]逝水比喻时光荏苒\n[00:39.610]终於我们不再\n[00:42.380]为了生命狂欢\n[00:46.600]为爱情狂乱\n[00:49.790]然而青春彼岸\n[00:53.430]盛夏正要一天\n[00:56.160]一天一天的灿烂\n[01:03.580]\n[01:11.820]\n[01:14.360]（然后呢，一起走吧）\n[01:20.140]谁说不能让我\n[01:22.890]此生唯一自传\n[01:26.640]如同诗一般\n[01:30.310]无论多远未来\n[01:33.970]读来依然一字一句\n[01:37.620]一篇都灿烂\n[01:45.899]让天空解释着蔚蓝\n[01:52.229]浮云定义着洁白\n[01:55.809]落花铺陈一片红色地毯\n[02:01.0]迎接我们到未来\n[02:05.600]\n[02:08.490]精彩未完的未来\n'
    }
  ],
  MUSIC_PLAYER_METING: process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING || false, // 是否要开启 MetingJS，从平台获取歌单。会覆盖自定义的 MUSIC_PLAYER_AUDIO_LIST，更多配置信息：https://github.com/metowolf/MetingJS
  MUSIC_PLAYER_METING_SERVER:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_SERVER || 'netease', // 音乐平台，[netease, tencent, kugou, xiami, baidu]
  MUSIC_PLAYER_METING_ID:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_ID || '60198', // 对应歌单的 id
  MUSIC_PLAYER_METING_LRC_TYPE:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_LRC_TYPE || '1', // 已废弃！！！可选值： 3 | 1 | 0（0：禁用 lrc 歌词，1：lrc 格式的字符串，3：lrc 文件 url）

  // 一个小插件展示你的facebook fan page~ @see https://tw.andys.pro/article/add-facebook-fanpage-notionnext
  FACEBOOK_PAGE_TITLE: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_TITLE || null, // 邊欄 Facebook Page widget 的標題欄，填''則無標題欄 e.g FACEBOOK 粉絲團'
  FACEBOOK_PAGE: process.env.NEXT_PUBLIC_FACEBOOK_PAGE || null, // Facebook Page 的連結 e.g https://www.facebook.com/tw.andys.pro
  FACEBOOK_PAGE_ID: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || '', // Facebook Page ID 來啟用 messenger 聊天功能
  FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '' // Facebook App ID 來啟用 messenger 聊天功能 获取: https://developers.facebook.com/
}
