<template>
  <view class="page">
    <view class="header">
      <view class="status-bar"></view>
      <view class="header-bar">
        <text class="header-title">手机参数</text>
        <view class="refresh-btn" hover-class="refresh-btn-hover" @click="reload">
          <text class="refresh-icon">⟳</text>
          <text class="refresh-text">刷新</text>
        </view>
      </view>
    </view>

    <view class="body">
      <!-- 设备列表 -->
      <template v-if="view === 'list'">
        <view class="loading" v-if="loading">
          <view class="spinner"></view>
          <text class="loading-text">加载中...</text>
        </view>

        <view class="error" v-else-if="errorMsg">
          <text class="error-text">{{ errorMsg }}</text>
          <view class="retry-btn" hover-class="retry-btn-hover" @click="loadList">重试</view>
        </view>

        <template v-else>
          <view class="list-tip">共 {{ list.length }} 台设备</view>
          <view
            class="device-card"
            v-for="device in list"
            :key="device.id"
            hover-class="device-card-hover"
            @click="openDevice(device)"
          >
            <view class="device-avatar" v-if="device.image && !device.imgFail">
              <image class="device-img" :src="resolveImage(device.image)" mode="aspectFit" @error="device.imgFail = true"></image>
            </view>
            <view class="device-avatar" v-else>
              <text class="device-avatar-icon">📱</text>
            </view>
            <view class="device-info">
              <text class="device-name">{{ device.brand }} {{ device.model }}</text>
              <text class="device-sub">{{ device.groupCount }} 组参数 · {{ device.itemCount }} 项</text>
            </view>
            <text class="card-arrow">›</text>
          </view>
          <view class="empty" v-if="!list.length">
            <text class="empty-text">暂无设备参数</text>
          </view>
        </template>
      </template>

      <!-- 设备参数详情 -->
      <template v-else-if="view === 'detail'">
        <view class="list-header">
          <view class="back-btn" hover-class="back-btn-hover" @click="goBackList">
            <text class="back-icon">‹</text>
          </view>
          <text class="list-title">{{ device ? device.brand + ' ' + device.model : '参数详情' }}</text>
        </view>

        <view class="loading" v-if="loading">
          <view class="spinner"></view>
          <text class="loading-text">加载中...</text>
        </view>

        <view class="error" v-else-if="errorMsg">
          <text class="error-text">{{ errorMsg }}</text>
          <view class="retry-btn" hover-class="retry-btn-hover" @click="reload">重试</view>
        </view>

        <template v-else-if="device">
          <view class="hero-card">
            <view class="hero-avatar" v-if="device.image && !device.imgFail">
              <image class="hero-img" :src="resolveImage(device.image)" mode="aspectFit" @error="device.imgFail = true"></image>
            </view>
            <view class="hero-avatar" v-else>
              <text class="hero-avatar-icon">📱</text>
            </view>
            <view class="hero-info">
              <text class="hero-brand">{{ device.brand }}</text>
              <text class="hero-name">{{ device.model }}</text>
              <text class="hero-time" v-if="device.updatedAt">更新于 {{ device.updatedAt }}</text>
            </view>
          </view>

          <view class="group-card" v-for="group in device.groups" :key="group.id !== undefined ? group.id : group.title">
            <view class="group-head">
              <view class="group-dot"></view>
              <text class="group-title">{{ group.title }}</text>
            </view>
            <view class="info-row" v-for="item in group.items" :key="item.id !== undefined ? item.id : item.label">
              <text class="info-label">{{ item.label }}</text>
              <text class="info-value">{{ item.value }}</text>
            </view>
          </view>

          <view class="list-end">— 参数由后端数据库提供 —</view>
        </template>
      </template>
    </view>

    <tabbar current="pages/device/device"></tabbar>
  </view>
</template>

<script>
import { getDeviceList, getDeviceInfo, resolveImage } from '@/api'

export default {
  data() {
    return {
      view: 'list',
      loading: true,
      errorMsg: '',
      list: [],
      device: null,
      deviceId: '',
    }
  },
  onLoad() {
    this.loadList()
  },
  onPullDownRefresh() {
    this.reload(() => uni.stopPullDownRefresh())
  },
  methods: {
    loadList() {
      this.loading = true
      this.errorMsg = ''
      getDeviceList()
        .then((list) => {
          this.list = list
        })
        .catch((err) => {
          this.errorMsg = err.message || '加载失败'
        })
        .finally(() => {
          this.loading = false
        })
    },
    openDevice(device) {
      this.view = 'detail'
      this.deviceId = device.id
      this.device = null
      this.loading = true
      this.errorMsg = ''
      getDeviceInfo(device.id)
        .then((data) => {
          this.device = data
        })
        .catch((err) => {
          this.errorMsg = err.message || '加载失败'
        })
        .finally(() => {
          this.loading = false
        })
    },
    resolveImage,
    goBackList() {
      this.view = 'list'
      this.device = null
    },
    reload(done) {
      if (this.view === 'list') {
        this.loadList()
      } else if (this.deviceId) {
        this.openDevice({ id: this.deviceId })
      }
      if (typeof done === 'function') done()
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
/* #ifdef H5 */
.status-bar {
  height: env(safe-area-inset-top);
}
/* #endif */
.header-bar {
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
}
.header-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #e6e8ee;
}
.refresh-btn {
  display: flex;
  align-items: center;
  padding: 10rpx 24rpx;
  border-radius: 999rpx;
  background-color: #1f242e;
  border: 1px solid #2c3342;
}
.refresh-btn-hover {
  opacity: 0.7;
}
.refresh-icon {
  font-size: 28rpx;
  color: #4c9aff;
  margin-right: 8rpx;
}
.refresh-text {
  font-size: 26rpx;
  color: #c3c9d6;
}

.body {
  padding: 24rpx 24rpx 200rpx;
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

.list-tip {
  font-size: 24rpx;
  color: #8b91a0;
  margin-bottom: 16rpx;
}

.device-card {
  display: flex;
  align-items: center;
  background-color: #1a1d24;
  border: 1px solid #262b36;
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}
.device-card-hover {
  background-color: #1f242e;
}
.device-avatar {
  width: 180rpx;
  height: 180rpx;
  border-radius: 28rpx;
  background-color: #1f242e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
  flex-shrink: 0;
  overflow: hidden;
}
.device-img {
  width: 100%;
  height: 100%;
}
.device-avatar-icon {
  font-size: 88rpx;
}
.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.device-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #e6e8ee;
}
.device-sub {
  font-size: 24rpx;
  color: #8b91a0;
  margin-top: 10rpx;
}
.card-arrow {
  font-size: 36rpx;
  color: #4b5563;
}

.list-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
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
  margin-right: 16rpx;
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
.list-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #e6e8ee;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.hero-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1c2333, #1a1d24);
  border: 1px solid #2c3342;
  border-radius: 20rpx;
  padding: 32rpx 28rpx;
  margin-bottom: 24rpx;
}
.hero-avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 32rpx;
  background-color: #1f242e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
  flex-shrink: 0;
  overflow: hidden;
}
.hero-img {
  width: 100%;
  height: 100%;
}
.hero-avatar-icon {
  font-size: 56rpx;
}
.hero-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.hero-brand {
  font-size: 26rpx;
  color: #8b91a0;
}
.hero-name {
  font-size: 38rpx;
  font-weight: 700;
  color: #e6e8ee;
  margin: 6rpx 0;
}
.hero-time {
  font-size: 22rpx;
  color: #6b7280;
}

.group-card {
  background-color: #1a1d24;
  border: 1px solid #262b36;
  border-radius: 20rpx;
  padding: 8rpx 28rpx;
  margin-bottom: 24rpx;
}
.group-head {
  display: flex;
  align-items: center;
  padding: 20rpx 0 12rpx;
  border-bottom: 1px solid #22262f;
}
.group-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: #4c9aff;
  margin-right: 12rpx;
}
.group-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #e6e8ee;
}
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 0;
  border-bottom: 1px solid #22262f;
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
  color: #e6e8ee;
  text-align: right;
  word-break: break-all;
}

.empty {
  display: flex;
  justify-content: center;
  padding: 120rpx 0;
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
    padding: 32px 24px 0;
  }
  .header-title {
    font-size: 30px;
  }
  .body {
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 60rpx;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    align-items: start;
  }
  .list-tip,
  .loading,
  .error,
  .empty,
  .list-header,
  .hero-card,
  .list-end {
    grid-column: 1 / -1;
  }
  .device-card {
    margin-bottom: 0;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease;
  }
  .device-card:hover {
    transform: translateY(-3px);
    border-color: #3a4356;
  }
  .group-card {
    margin-bottom: 0;
  }
}
/* #endif */
</style>
