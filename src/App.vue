<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/* 全局深色样式：固定深色，不随系统深浅色模式变化 */
page {
  background-color: #0f1115;
  background-image:
    radial-gradient(55% 42% at 12% 0%, rgba(92, 179, 255, 0.16), transparent 62%),
    radial-gradient(48% 38% at 92% 6%, rgba(139, 92, 246, 0.12), transparent 60%),
    radial-gradient(60% 45% at 55% 108%, rgba(52, 211, 153, 0.07), transparent 62%);
  background-repeat: no-repeat;
  color: #e6e8ee;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* #ifdef H5 */
/* 毛玻璃：主要表面统一模糊与光晕（H5 独有） */
.header,
.tabbar,
.a-header,
.table,
.amodal-box,
.login-box,
.project-card,
.brand-card,
.device-card,
.record-card,
.group-card,
.hero-card,
.spec-card,
.note-card,
.form-card,
.params-card,
.basic-card,
.image-card {
  backdrop-filter: blur(14px) saturate(1.3);
  -webkit-backdrop-filter: blur(14px) saturate(1.3);
}
/* #endif */

/* 管理后台通用样式（仅 H5 管理页使用） */
.a-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36rpx 40rpx;
  border-bottom: 1px solid #262b36;
  background-color: rgba(20, 22, 27, 0.85);
}
/* #ifdef H5 */
.a-header {
  padding-top: calc(36rpx + env(safe-area-inset-top));
}
/* 手机端管理页：表格横向滚动、窄屏幕单列布局 */
@media (max-width: 767px) {
  .table {
    overflow-x: auto;
  }
  .tr {
    min-width: 760px;
  }
  .a-header {
    flex-wrap: wrap;
  }
}
/* #endif */
.a-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #e6e8ee;
}
.a-actions {
  display: flex;
  align-items: center;
}
.a-btn {
  padding: 16rpx 36rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #3d7ef5, #5cb3ff);
  color: #ffffff;
  font-size: 28rpx;
  cursor: pointer;
}
.a-btn-ghost {
  background-color: rgba(31, 36, 46, 0.65);
  border: 1px solid rgba(92, 179, 255, 0.2);
  color: #c3c9d6;
  margin-right: 20rpx;
}
.a-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32rpx 40rpx 80rpx;
}

/* 表格 */
.table {
  background-color: rgba(24, 27, 34, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16rpx;
  overflow: hidden;
}
.tr {
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.tr:last-child {
  border-bottom: none;
}
.tr-th {
  background-color: rgba(31, 36, 46, 0.65);
  padding: 20rpx 24rpx;
}
.th {
  font-size: 24rpx;
  color: #9aa3b2;
}
.td {
  font-size: 26rpx;
  color: #e6e8ee;
  padding: 22rpx 0;
  margin-right: 16rpx;
  word-break: break-all;
}
.link {
  font-size: 26rpx;
  color: #5cb3ff;
  margin-right: 28rpx;
  cursor: pointer;
}
.link-danger {
  color: #ef4444;
}

/* 表单 */
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 24rpx;
}
.field-label {
  font-size: 24rpx;
  color: #9aa3b2;
  margin-bottom: 10rpx;
}
.field-input {
  background-color: #0f1115;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  font-size: 28rpx;
  color: #e6e8ee;
}
.form-row2 {
  display: flex;
}
.form-row2 .field {
  flex: 1;
}
.form-row2 .field + .field {
  margin-left: 24rpx;
}
</style>
