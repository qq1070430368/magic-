// 检测版本信息
function run(kit) {
    kit.log('tips: 在项目根目录、开始运行构建任务');
    // 检测构建环境
    kit.checkNodeVer(); // 检测node版本
    kit.checkNpm(); // 检测npm版本
}

module.exports = {
    run
};