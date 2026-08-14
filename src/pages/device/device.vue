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
      <!-- 品牌列表 -->
      <template v-if="view === 'brands'">
        <view class="loading" v-if="loading">
          <view class="spinner"></view>
          <text class="loading-text">加载中...</text>
        </view>

        <view class="error" v-else-if="errorMsg">
          <text class="error-text">{{ errorMsg }}</text>
          <view class="retry-btn" hover-class="retry-btn-hover" @click="loadList">重试</view>
        </view>

        <template v-else>
          <view class="list-tip">共 {{ brandGroups.length }} 个品牌</view>
          <view class="brand-grid">
            <view
              class="brand-card"
              v-for="group in brandGroups"
              :key="group.brand"
              hover-class="brand-card-hover"
              @click="openBrand(group)"
            >
              <view class="brand-avatar" v-if="group.logo && !group.imgFail">
                <image class="brand-img" :src="resolveImage(group.logo)" mode="aspectFit" @error="group.imgFail = true"></image>
              </view>
              <view class="brand-avatar" v-else>
                <text class="brand-avatar-icon">📱</text>
              </view>
              <text class="brand-name">{{ group.brand }}</text>
              <text class="brand-sub">{{ group.devices.length }} 款机型</text>
            </view>
          </view>
          <view class="empty" v-if="!brandGroups.length">
            <text class="empty-text">暂无设备参数</text>
          </view>
        </template>
      </template>

      <!-- 品牌下的机型列表 -->
      <template v-else-if="view === 'devices'">
        <view class="list-header">
          <view class="back-btn" hover-class="back-btn-hover" @click="goBackBrands">
            <text class="back-icon">‹</text>
          </view>
          <text class="list-title">{{ currentBrand }}</text>
        </view>

        <view
          class="device-card"
          v-for="device in brandDevices"
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
      </template>

      <!-- 设备参数详情 -->
      <template v-else-if="view === 'detail'">
        <view class="list-header">
          <view class="back-btn" hover-class="back-btn-hover" @click="goBackDevices">
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
import { getDeviceList, getDeviceInfo, getBrands, resolveImage } from '@/api'

export default {
  data() {
    return {
      view: 'brands',
      loading: true,
      errorMsg: '',
      list: [],
      brandImages: {},
      currentBrand: '',
      device: null,
      deviceId: '',
    }
  },
  computed: {
    brandGroups() {
      const map = {}
      this.list.forEach((d) => {
        if (!map[d.brand]) map[d.brand] = { brand: d.brand, devices: [] }
        map[d.brand].devices.push(d)
      })
      return Object.keys(map).map((k) => ({
        brand: k,
        devices: map[k].devices,
        logo: this.brandImages[k] || '',
      }))
    },
    brandDevices() {
      const group = this.brandGroups.find((g) => g.brand === this.currentBrand)
      return group ? group.devices : []
    },
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
      Promise.all([getDeviceList(), getBrands()])
        .then(([list, brands]) => {
          this.list = list
          const map = {}
          ;(brands || []).forEach((b) => {
            map[b.name] = b.image || ''
          })
          this.brandImages = map
        })
        .catch((err) => {
          this.errorMsg = err.message || '加载失败'
        })
        .finally(() => {
          this.loading = false
        })
    },
    openBrand(group) {
      this.currentBrand = group.brand
      this.view = 'devices'
    },
    goBackBrands() {
      this.view = 'brands'
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
    goBackDevices() {
      this.device = null
      this.view = 'devices'
    },
    reload(done) {
      if (this.view === 'brands') {
        this.loadList()
      } else if (this.view === 'devices') {
        this.loadList()
      } else if (this.deviceId) {
        this.openDevice({ id: this.deviceId })
      }
      if (typeof done === 'function') done()
    },
    resolveImage,
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: transparent;
  box-sizing: border-box;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(20, 22, 27, 0.85);
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
  background-color: rgba(31, 36, 46, 0.65);
  border: 1px solid rgba(92, 179, 255, 0.2);
}
.refresh-btn-hover {
  opacity: 0.7;
}
.refresh-icon {
  font-size: 28rpx;
  color: #5cb3ff;
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
  border-top-color: #5cb3ff;
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
  color: #9aa3b2;
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
  background: linear-gradient(135deg, #3d7ef5, #5cb3ff);
  color: #ffffff;
  font-size: 28rpx;
}
.retry-btn-hover {
  opacity: 0.8;
}

.list-tip {
  font-size: 24rpx;
  color: #9aa3b2;
  margin-bottom: 16rpx;
}

/* 品牌卡片：正方形，上图标下文字 */
.brand-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.brand-card {
  width: 48%;
  box-sizing: border-box;
  background-color: rgba(24, 27, 34, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20rpx;
  padding: 28rpx 16rpx 26rpx;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 300rpx;
}
.brand-card-hover {
  background-color: rgba(31, 36, 46, 0.65);
}
.brand-avatar {
  width: 170rpx;
  height: 170rpx;
  border-radius: 32rpx;
  background-color: rgba(31, 36, 46, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  margin-bottom: 18rpx;
}
.brand-avatar-icon {
  font-size: 84rpx;
}
.brand-img {
  width: 100%;
  height: 100%;
}
.brand-name {
  font-size: 28rpx;
  font-weight: 700;
  color: #e6e8ee;
  text-align: center;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
  line-height: 1.3;
  max-width: 100%;
}
.brand-sub {
  font-size: 22rpx;
  color: #9aa3b2;
  margin-top: 8rpx;
  text-align: center;
}
.card-arrow {
  font-size: 36rpx;
  color: #4b5563;
}

/* 机型卡片 */
.device-card {
  display: flex;
  align-items: center;
  background-color: rgba(24, 27, 34, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}
.device-card-hover {
  background-color: rgba(31, 36, 46, 0.65);
}
.device-avatar {
  width: 180rpx;
  height: 180rpx;
  border-radius: 28rpx;
  background-color: rgba(31, 36, 46, 0.65);
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
  word-break: break-all;
}
.device-sub {
  font-size: 24rpx;
  color: #9aa3b2;
  margin-top: 10rpx;
}

/* 返回头 */
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
  background-color: rgba(31, 36, 46, 0.65);
  border: 1px solid rgba(92, 179, 255, 0.2);
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

/* 详情 */
.hero-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(47, 139, 255, 0.3), rgba(26, 29, 36, 0.55));
  border: 1px solid rgba(92, 179, 255, 0.2);
  border-radius: 20rpx;
  padding: 32rpx 28rpx;
  margin-bottom: 24rpx;
}
.hero-avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 32rpx;
  background-color: rgba(31, 36, 46, 0.65);
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
  font-size: 80rpx;
}
.hero-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.hero-brand {
  font-size: 26rpx;
  color: #9aa3b2;
}
.hero-name {
  font-size: 38rpx;
  font-weight: 700;
  color: #e6e8ee;
  margin: 6rpx 0;
}
.hero-time {
  font-size: 22rpx;
  color: #7c8598;
}

.group-card {
  background-color: rgba(24, 27, 34, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20rpx;
  padding: 8rpx 28rpx;
  margin-bottom: 24rpx;
}
.group-head {
  display: flex;
  align-items: center;
  padding: 20rpx 0 12rpx;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.group-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #3d7ef5, #5cb3ff);
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.info-row:last-child {
  border-bottom: none;
}
.info-label {
  font-size: 26rpx;
  color: #9aa3b2;
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
  color: #7c8598;
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
  .list-end,
  .brand-grid {
    grid-column: 1 / -1;
  }
  .brand-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
  }
  .brand-card {
    width: auto;
    height: auto;
    margin-bottom: 0;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease;
  }
  .brand-card:hover {
    transform: translateY(-3px);
    border-color: #3a4356;
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
