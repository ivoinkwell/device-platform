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
  color: #e6e8ee;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 管理后台通用样式（仅 H5 管理页使用） */
.a-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36rpx 40rpx;
  border-bottom: 1px solid #262b36;
  background-color: #14161b;
}
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
  background-color: #4c9aff;
  color: #ffffff;
  font-size: 28rpx;
  cursor: pointer;
}
.a-btn-ghost {
  background-color: #1f242e;
  border: 1px solid #2c3342;
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
  background-color: #1a1d24;
  border: 1px solid #262b36;
  border-radius: 16rpx;
  overflow: hidden;
}
.tr {
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  border-bottom: 1px solid #22262f;
}
.tr:last-child {
  border-bottom: none;
}
.tr-th {
  background-color: #1f242e;
  padding: 20rpx 24rpx;
}
.th {
  font-size: 24rpx;
  color: #8b91a0;
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
  color: #4c9aff;
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
  color: #8b91a0;
  margin-bottom: 10rpx;
}
.field-input {
  background-color: #0f1115;
  border: 1px solid #262b36;
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
