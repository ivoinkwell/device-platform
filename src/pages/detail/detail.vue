<template>
  <view class="page">
    <view class="header">
      <view class="status-bar"></view>
      <view class="header-bar">
        <view class="back-btn" hover-class="back-btn-hover" @click="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="header-title">{{ project ? project.name : '项目详情' }}</text>
        <view class="header-placeholder"></view>
      </view>
    </view>

    <view class="body">
      <view class="loading" v-if="loading">
        <view class="spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>

      <view class="error" v-else-if="errorMsg">
        <text class="error-text">{{ errorMsg }}</text>
        <view class="retry-btn" hover-class="retry-btn-hover" @click="loadData">重试</view>
      </view>

      <template v-else-if="project">
        <view class="hero-card">
          <text class="hero-name">{{ project.name }}</text>
          <text class="hero-remark" v-if="project.remark">{{ project.remark }}</text>
          <text class="hero-time">录入于 {{ project.createdAt }} · {{ project.records.length }} 款机型</text>
        </view>

        <view class="record-card" v-for="record in project.records" :key="record.id">
          <!-- 机型头部 -->
          <view class="record-head" v-if="record.device">
            <view class="record-thumb" v-if="record.device.image && !record.device.imgFail">
              <image class="record-img" :src="resolveImage(record.device.image)" mode="aspectFit" @error="record.device.imgFail = true"></image>
            </view>
            <view class="record-thumb" v-else>
              <text class="record-thumb-icon">📱</text>
            </view>
            <view class="record-head-main">
              <text class="record-device">{{ record.device.brand }} {{ record.device.model }}</text>
              <text class="record-time" v-if="record.device.updatedAt">参数更新于 {{ record.device.updatedAt }}</text>
            </view>
          </view>

          <!-- 手机参数：实时引用手机参数管理 -->
          <view class="sub-section" v-if="record.device && record.device.groups">
            <view class="sub-title">
              <text class="sub-dot"></text>
              <text class="sub-text">手机参数</text>
            </view>
            <view class="param-group" v-for="group in record.device.groups" :key="group.id !== undefined ? group.id : group.title">
              <view class="param-group-head">
                <text class="param-group-title">{{ group.title }}</text>
              </view>
              <view class="info-row" v-for="item in group.items" :key="item.id !== undefined ? item.id : item.label">
                <text class="info-label">{{ item.label }}</text>
                <text class="info-value">{{ item.value }}</text>
              </view>
            </view>
          </view>

          <!-- 测试结果 -->
          <view class="sub-section">
            <view class="sub-title">
              <text class="sub-dot result-dot"></text>
              <text class="sub-text">测试结果</text>
              <text class="sub-count">{{ record.params.length }} 项</text>
            </view>
            <view class="params-card">
              <view class="info-row" v-for="param in record.params" :key="param.id !== undefined ? param.id : param.label">
                <text class="info-label">{{ param.label }}</text>
                <text class="info-value">{{ param.value }}</text>
              </view>
              <view class="params-empty" v-if="!record.params.length">暂无测试结果</view>
            </view>
          </view>
        </view>

        <view class="empty" v-if="!project.records.length">
          <text class="empty-text">该项目暂无机型测试数据</text>
        </view>

        <view class="list-end">— 测试数据由后端数据库提供 —</view>
      </template>
    </view>
  </view>
</template>

<script>
import { getProjectDetail, resolveImage } from '@/api'

export default {
  data() {
    return {
      id: '',
      loading: true,
      errorMsg: '',
      project: null,
    }
  },
  onLoad(options) {
    this.id = options.id || ''
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true
      this.errorMsg = ''
      getProjectDetail(this.id)
        .then((data) => {
          this.project = data
        })
        .catch((err) => {
          this.errorMsg = err.message || '加载失败'
        })
        .finally(() => {
          this.loading = false
        })
    },
    resolveImage,
    goBack() {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        uni.reLaunch({ url: '/pages/index/index' })
      }
    },
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #0f1115;
  box-sizing: border-box;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #14161b;
  border-bottom: 1px solid #262b36;
}
.status-bar {
  height: var(--status-bar-height);
}
.header-bar {
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
}
.back-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #1f242e;
  border: 1px solid #2c3342;
}
.back-btn-hover {
  opacity: 0.7;
}
.back-icon {
  font-size: 44rpx;
  color: #e6e8ee;
  line-height: 1;
  margin-top: -6rpx;
}
.header-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #e6e8ee;
  max-width: 480rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.header-placeholder {
  width: 64rpx;
  height: 64rpx;
}

.body {
  padding: 24rpx 24rpx 60rpx;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 200rpx 0;
}
.spinner {
  width: 56rpx;
  height: 56rpx;
  border: 6rpx solid #262b36;
  border-top-color: #4c9aff;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.loading-text {
  margin-top: 24rpx;
  font-size: 26rpx;
  color: #8b91a0;
}
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 200rpx 0;
}
.error-text {
  font-size: 28rpx;
  color: #ef4444;
}
.retry-btn {
  margin-top: 32rpx;
  padding: 14rpx 48rpx;
  border-radius: 999rpx;
  background-color: #4c9aff;
  color: #ffffff;
  font-size: 28rpx;
}
.retry-btn-hover {
  opacity: 0.8;
}

.hero-card {
  background: linear-gradient(135deg, #1c2333, #1a1d24);
  border: 1px solid #2c3342;
  border-radius: 20rpx;
  padding: 36rpx 32rpx;
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;
}
.hero-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #e6e8ee;
}
.hero-remark {
  font-size: 26rpx;
  color: #8b91a0;
  margin-top: 12rpx;
}
.hero-time {
  font-size: 22rpx;
  color: #6b7280;
  margin-top: 12rpx;
}

/* 机型记录卡片 */
.record-card {
  background-color: #1a1d24;
  border: 1px solid #262b36;
  border-radius: 20rpx;
  padding: 24rpx 28rpx 8rpx;
  margin-bottom: 24rpx;
}
.record-head {
  display: flex;
  align-items: center;
  padding-bottom: 16rpx;
  border-bottom: 1px solid #22262f;
  margin-bottom: 8rpx;
}
.record-thumb {
  width: 180rpx;
  height: 180rpx;
  border-radius: 28rpx;
  background-color: #1f242e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
  overflow: hidden;
}
.record-img {
  width: 100%;
  height: 100%;
}
.record-thumb-icon {
  font-size: 88rpx;
}
.record-head-main {
  display: flex;
  flex-direction: column;
}
.record-device {
  font-size: 32rpx;
  font-weight: 700;
  color: #e6e8ee;
}
.record-time {
  font-size: 20rpx;
  color: #6b7280;
  margin-top: 6rpx;
}

.sub-section {
  margin-bottom: 16rpx;
}
.sub-title {
  display: flex;
  align-items: center;
  padding: 12rpx 0 10rpx;
}
.sub-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background-color: #4c9aff;
  margin-right: 10rpx;
}
.result-dot {
  background-color: #22c55e;
}
.sub-text {
  font-size: 26rpx;
  font-weight: 600;
  color: #c3c9d6;
}
.sub-count {
  font-size: 22rpx;
  color: #6b7280;
  margin-left: auto;
}

.param-group {
  background-color: #1f242e;
  border: 1px solid #2c3342;
  border-radius: 16rpx;
  padding: 4rpx 24rpx;
  margin-bottom: 16rpx;
}
.param-group-head {
  padding: 14rpx 0 8rpx;
  border-bottom: 1px solid #2c3342;
}
.param-group-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #4c9aff;
}

.params-card {
  background-color: #1f242e;
  border: 1px solid #2c3342;
  border-radius: 16rpx;
  padding: 4rpx 24rpx;
}
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1px solid #2c3342;
}
.info-row:last-child {
  border-bottom: none;
}
.info-label {
  font-size: 26rpx;
  color: #8b91a0;
  margin-right: 24rpx;
  flex-shrink: 0;
}
.info-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #e6e8ee;
  text-align: right;
  word-break: break-all;
}
.params-empty {
  padding: 28rpx 0;
  font-size: 26rpx;
  color: #6b7280;
  text-align: center;
}

.empty {
  display: flex;
  justify-content: center;
  padding: 80rpx 0;
}
.empty-text {
  font-size: 26rpx;
  color: #6b7280;
}
.list-end {
  text-align: center;
  font-size: 22rpx;
  color: #4b5563;
  padding: 24rpx 0;
}

/* #ifdef H5 */
/* 桌面端布局 */
@media (min-width: 768px) {
  .page {
    padding-top: 64px;
  }
  .header {
    position: static;
    background-color: transparent;
    border-bottom: none;
  }
  .header-bar {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 24px 0;
  }
  .header-title {
    font-size: 22px;
    max-width: 700px;
  }
  .body {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    align-items: start;
  }
  .hero-card,
  .loading,
  .error,
  .empty,
  .list-end {
    grid-column: 1 / -1;
  }
  .record-card {
    margin-bottom: 0;
  }
}
@media (min-width: 1100px) {
  .body {
    grid-template-columns: repeat(3, 1fr);
  }
}
/* #endif */
</style>
