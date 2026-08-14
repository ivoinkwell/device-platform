<template>
  <view class="page">
    <view class="header">
      <view class="status-bar"></view>
      <view class="header-bar">
        <text class="header-title">测试数据</text>
        <view class="refresh-btn" hover-class="refresh-btn-hover" @click="loadData">
          <text class="refresh-icon">⟳</text>
          <text class="refresh-text">刷新</text>
        </view>
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

      <template v-else>
        <view class="list-tip">共 {{ list.length }} 个测试项目</view>

        <view
          class="project-card"
          v-for="project in list"
          :key="project.id"
          hover-class="project-card-hover"
          @click="goDetail(project)"
        >
          <view class="card-head">
            <text class="project-name">{{ project.name }}</text>
            <view class="param-count">{{ project.recordCount }} 款机型</view>
          </view>
          <text class="project-remark" v-if="project.remark">{{ project.remark }}</text>
          <view class="card-foot">
            <text class="project-time">录入于 {{ project.createdAt }}</text>
            <text class="card-arrow">›</text>
          </view>
        </view>

        <view class="empty" v-if="!list.length">
          <text class="empty-text">暂无测试项目</text>
        </view>

        <view class="list-end" v-if="list.length">— 已加载全部数据 —</view>
      </template>
    </view>

    <tabbar current="pages/index/index"></tabbar>
  </view>
</template>

<script>
import { getProjectList } from '@/api'

export default {
  data() {
    return {
      loading: true,
      errorMsg: '',
      list: [],
    }
  },
  onLoad() {
    this.loadData()
  },
  onPullDownRefresh() {
    this.loadData(() => uni.stopPullDownRefresh())
  },
  methods: {
    loadData(done) {
      this.loading = true
      this.errorMsg = ''
      getProjectList()
        .then((list) => {
          this.list = list
        })
        .catch((err) => {
          this.errorMsg = err.message || '加载失败'
        })
        .finally(() => {
          this.loading = false
          if (typeof done === 'function') done()
        })
    },
    goDetail(project) {
      uni.navigateTo({ url: '/pages/detail/detail?id=' + project.id })
    },
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

.project-card {
  background-color: rgba(24, 27, 34, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24rpx;
  padding: 40rpx 36rpx;
  margin-bottom: 24rpx;
}
.project-card-hover {
  background-color: rgba(31, 36, 46, 0.65);
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.project-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #e6e8ee;
  flex: 1;
  margin-right: 16rpx;
}
.param-count {
  font-size: 24rpx;
  color: #5cb3ff;
  background-color: rgba(92, 179, 255, 0.12);
  border: 1px solid rgba(92, 179, 255, 0.35);
  border-radius: 999rpx;
  padding: 8rpx 22rpx;
}
.project-remark {
  display: block;
  font-size: 26rpx;
  color: #9aa3b2;
  margin-top: 16rpx;
}
.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 20rpx;
  margin-top: 20rpx;
}
.project-time {
  font-size: 24rpx;
  color: #7c8598;
}
.card-arrow {
  font-size: 44rpx;
  color: #4b5563;
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
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    align-items: start;
  }
  .list-tip,
  .loading,
  .error,
  .empty,
  .list-end {
    grid-column: 1 / -1;
  }
  .project-card {
    margin-bottom: 0;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease;
  }
  .project-card:hover {
    transform: translateY(-3px);
    border-color: #3a4356;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.4);
  }
}
@media (min-width: 1100px) {
  .body {
    grid-template-columns: repeat(3, 1fr);
  }
}
/* #endif */
</style>
