const CONFIG = {
  // 🌿 1. 首页横幅与大视觉氛围配置
  GARDEN_HOME_BANNER_ENABLE: true, // 是否显示首页大横幅
  GARDEN_HOME_BANNER_GREETINGS: [
    '欢迎来到我的数字生命花园 🌱',
    '这里有一棵正在随文字生长的年轮大树 🌳',
    '记录思维碎片的时光机热力图正在平稳运转 🌞',
    '随意逛逛吧，祝你今天过得愉快 ✨'
  ], // 首页大标语随风摇摆的治愈文字

  GARDEN_HOME_NAV_BUTTONS: true, // 首页是否显示生态分类大图标按钮
  GARDEN_HOME_NAV_BACKGROUND_IMG_FIXED: false, // 首页背景图滚动时是否固定
  GARDEN_SHOW_START_READING: true, // 是否显示“步入花园”/“开始阅读”按钮

  // 🌿 2. 顶部微风导航菜单配置
  GARDEN_MENU_INDEX: true, // 显示首页（大树核心舞台）
  GARDEN_MENU_CATEGORY: true, // 显示植物分类
  GARDEN_MENU_TAG: true, // 显示晾衣绳标签云
  GARDEN_MENU_ARCHIVE: true, // 显示年轮归档
  GARDEN_MENU_SEARCH: true, // 显示林间搜索
  GARDEN_MENU_RANDOM: true, // 显示随机传送按钮

  // 🌿 3. 瀑布流文章卡片（Sprout Post Card）细节控制
  GARDEN_POST_LIST_COVER: true, // 文章列表显示精美植物封面
  GARDEN_POST_LIST_COVER_HOVER_ENLARGE: true, // 鼠标悬停时，手绘卡片图片平滑放大特效 🌟 (开启以增强交互)
  GARDEN_POST_LIST_COVER_DEFAULT: true, // 封面为空时用数字花园背景做默认垫底
  GARDEN_POST_LIST_SUMMARY: true, // 显示内容摘要
  GARDEN_POST_LIST_PREVIEW: false, // 读取文章预览
  GARDEN_POST_LIST_IMG_CROSSOVER: true, // 卡片图片左右交错，制造错落有致的林间小路感

  // 🌿 4. 文章内页与知识版权保护
  GARDEN_ARTICLE_ADJACENT: true, // 显示相邻文章推荐卡片
  GARDEN_ARTICLE_COPYRIGHT: true, // 显示温润的花园文章版权声明
  GARDEN_ARTICLE_NOT_BY_AI: false, // 显示非AI写作标签
  GARDEN_ARTICLE_RECOMMEND: true, // 文章底部关联植物推荐

  // 🌿 5. 右下角微风悬浮操作区（包含夜间模式按钮）
  GARDEN_WIDGET_LATEST_POSTS: true, // 右侧栏：显示最新栽培文章卡片
  GARDEN_WIDGET_ANALYTICS: true, // 右侧栏：显示全站植物卡片统计
  GARDEN_WIDGET_TO_TOP: true, // 悬浮：回到顶部（飞天嫩芽）
  GARDEN_WIDGET_TO_COMMENT: true, // 悬浮：直达树洞评论区
  GARDEN_WIDGET_DARK_MODE: true, // 悬浮：【核心】开启黑夜/白天模式切换月亮按钮 🌟
  GARDEN_WIDGET_TOC: true, // 移动端悬浮树状大纲目录

  // 🌿 6. 核心视觉主题色（对应 style.js 与 style.css 的全局变量基础）
  GARDEN_THEME_COLOR: '#84cc16', // 🌟 已为您替换为血统纯正、治愈清新的“花园嫩绿”

  /** 文章详情页客户端切换时，主栏显示卡片+转圈占位（无全屏遮罩；已有独立 LoadingCover 的主题无需此项） */
  GARDEN_ARTICLE_ROUTE_LOADING: true,

  // ==========================================================================
  // 🌳 7. 数字花园特供 - 生态树与时光机高级扩展变量 (未来可随意扩容)
  // ==========================================================================
  GARDEN_TREE_MAX_DEPTH: 11,        // 生态树最大分裂深度（数值越大树枝越茂密，建议9-12之间）
  GARDEN_TREE_GROW_SPEED: 0.05,     // 树苗破土而出的动画生长速度（0.01~0.1之间）
  GARDEN_HEATMAP_COLOR_REVERSE: false // 时光机热力图格子颜色是否反转（默认越写文章颜色越绿）

}

export default CONFIG