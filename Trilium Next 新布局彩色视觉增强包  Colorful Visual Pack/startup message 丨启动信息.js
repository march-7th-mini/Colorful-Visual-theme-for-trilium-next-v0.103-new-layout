/* ============================================================
 *  Startup Message | 启动信息 (MoTD)
 * ============================================================
 *
 *  [ English ]
 *  Displays a random "Message of The Day" (MoTD) as a toast
 *  notification when Trilium starts up.
 *
 *  Runs as a frontendStartup script — add #run=frontendStartup
 *  label to activate.
 *
 *  Messages are read from the child "config" note's
 *  config.messages array.
 *
 *  The 2-second delay ensures VOCALOID toast styles are loaded
 *  before the message appears.
 *
 *
 *  [ 中文 ]
 *  Trilium 启动时随机选一条信息以 Toast 通知显示（MoTD）。
 *
 *  作为 frontendStartup 脚本运行——添加 #run=frontendStartup
 *  标签即可激活。
 *
 *  信息从子笔记 "config" 的 config.messages 数组中读取。
 *
 *  延迟 2 秒执行，以确保 VOCALOID toast 样式加载完成后再显示。
 *
 *  Credits / 致谢:
 *    Original author: Nriver
 *    Adapted for Trilium Next v0.103.0 by march-7th-mini
 *    原作者: Nriver
 *    适配: march-7th-mini
 * ============================================================
 */

console.log("banner startup notification 启动通知");

// 从配置文件读取信息
var messages = config.messages;
var msg = messages[Math.floor(Math.random()*messages.length)];

// 延迟显示，等待 toast 样式就绪
setTimeout(function() {
    api.showMessage(msg);
}, 2000);
