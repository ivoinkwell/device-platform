<template>
  <view class="page">
    <view class="a-header">
      <view class="a-head-left">
        <text class="a-title">品牌 Logo 管理</text>
        <admin-nav current="brands"></admin-nav>
      </view>
      <view class="a-actions">
        <view class="a-btn a-btn-ghost" hover-class="btn-hover" @click="load">刷新</view>
      </view>
    </view>

    <view class="a-body">
      <view class="loading" v-if="loading">
        <view class="spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>

      <view class="error" v-else-if="errorMsg">
        <text class="error-text">{{ errorMsg }}</text>
        <view class="retry-btn" hover-class="btn-hover" @click="load">重试</view>
      </view>

      <template v-else>
        <view class="tip">品牌来自手机参数管理中的设备自动汇总，Logo 单独上传（用于前台品牌列表展示）</view>
        <view class="brand-grid">
          <view class="brand-card" v-for="brand in brands" :key="brand.name">
            <view class="brand-preview" v-if="brand.image && !brand.imgFail">
              <image class="brand-img" :src="resolveImage(brand.image)" mode="aspectFit" @error="brand.imgFail = true"></image>
            </view>
            <view class="brand-preview" v-else>
              <text class="brand-fallback">📱</text>
            </view>
            <text class="brand-name">{{ brand.name }}</text>
            <view class="brand-actions">
              <view class="a-btn a-btn-ghost" hover-class="btn-hover" @click="upload(brand)">上传</view>
              <view class="a-btn a-btn-ghost" hover-class="btn-hover" v-if="brand.image" @click="removeImage(brand)">移除</view>
            </view>
          </view>
          <view class="empty" v-if="!brands.length">
            <text class="empty-text">暂无品牌，请先在手机参数管理中添加设备</text>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<script>
import { adminGetDevices, adminGetBrands, adminSaveBrandImage, adminUploadImage, requireLogin } from '@/api/admin'
import { resolveImage } from '@/api'

export default {
  data() {
    return {
      loading: true,
      errorMsg: '',
      brands: [],
    }
  },
  onLoad() {
    if (!requireLogin()) return
    this.load()
  },
  methods: {
    load() {
      this.loading = true
      this.errorMsg = ''
      Promise.all([adminGetDevices(), adminGetBrands()])
        .then(([devices, brandImages]) => {
          const map = {}
          ;(brandImages || []).forEach((b) => {
            map[b.name] = b.image || ''
          })
          const names = []
          devices.forEach((d) => {
            if (names.indexOf(d.brand) === -1) names.push(d.brand)
          })
          names.sort()
          this.brands = names.map((n) => ({ name: n, image: map[n] || '', imgFail: false }))
        })
        .catch((err) => {
          this.errorMsg = err.message || '加载失败'
        })
        .finally(() => {
          this.loading = false
        })
    },
    upload(brand) {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          const filePath = res.tempFilePaths[0]
          uni.showLoading({ title: '上传中...' })
          adminUploadImage(filePath)
            .then((url) => adminSaveBrandImage(brand.name, url))
            .then(() => {
              uni.showToast({ title: '已上传', icon: 'success' })
              this.load()
            })
            .catch((err) => uni.showToast({ title: err.message || '上传失败', icon: 'none' }))
            .finally(() => uni.hideLoading())
        },
      })
    },
    removeImage(brand) {
      uni.showModal({
        title: '移除 Logo',
        content: `确定移除「${brand.name}」的品牌 Logo 吗？`,
        confirmText: '移除',
        cancelText: '取消',
        confirmColor: '#ef4444',
        success: (res) => {
          if (!res.confirm) return
          adminSaveBrandImage(brand.name, '')
            .then(() => {
              uni.showToast({ title: '已移除', icon: 'success' })
              this.load()
            })
            .catch((err) => uni.showToast({ title: err.message || '操作失败', icon: 'none' }))
        },
      })
    },
    resolveImage,
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #0f1115;
}
.a-head-left {
  display: flex;
  align-items: center;
}
.a-btn-ghost {
  background-color: #1f242e;
  border: 1px solid #2c3342;
  color: #c3c9d6;
  margin-right: 20rpx;
}
.btn-hover {
  opacity: 0.8;
}
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;
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
  padding: 160rpx 0;
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
  cursor: pointer;
}
.tip {
  font-size: 24rpx;
  color: #8b91a0;
  margin-bottom: 24rpx;
}
.brand-grid {
  display: flex;
  flex-wrap: wrap;
}
.brand-card {
  width: 220rpx;
  box-sizing: border-box;
  background-color: #1a1d24;
  border: 1px solid #262b36;
  border-radius: 16rpx;
  padding: 24rpx;
  margin: 0 20rpx 20rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.brand-preview {
  width: 140rpx;
  height: 140rpx;
  border-radius: 20rpx;
  background-color: #1f242e;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 16rpx;
}
.brand-img {
  width: 100%;
  height: 100%;
}
.brand-fallback {
  font-size: 64rpx;
}
.brand-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #e6e8ee;
  margin-bottom: 16rpx;
}
.brand-actions {
  display: flex;
}
.empty {
  width: 100%;
  text-align: center;
  padding: 100rpx 0;
}
.empty-text {
  font-size: 26rpx;
  color: #6b7280;
}
</style>
