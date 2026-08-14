<template>
  <view class="tabbar" :class="{ 'tabbar-desktop-only': desktopOnly }">
    <!-- #ifdef H5 -->
    <view class="tabbar-brand">谦哥数码数据库</view>
    <!-- #endif -->
    <view
      class="tabbar-item"
      v-for="item in tabList"
      :key="item.path"
      hover-class="tabbar-item-hover"
      @click="switchTab(item)"
    >
      <text class="tabbar-icon">{{ item.icon }}</text>
      <text class="tabbar-text" :class="{ 'tabbar-text-active': item.path === current }">{{ item.text }}</text>
    </view>
    <!-- #ifdef H5 -->
    <view class="tabbar-item tabbar-admin" hover-class="tabbar-item-hover" @click="goAdmin">
      <text class="tabbar-icon">⚙️</text>
      <text class="tabbar-text">管理</text>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  name: 'custom-tabbar',
  props: {
    // 当前激活的页面路径
    current: {
      type: String,
      default: '',
    },
    // 仅桌面端(H5 宽屏)显示，移动端隐藏（用于详情等二级页面）
    desktopOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tabList: [
        { path: 'pages/index/index', text: '测试数据', icon: '📊' },
        { path: 'pages/device/device', text: '手机参数', icon: '📱' },
      ],
    }
  },
  methods: {
    switchTab(item) {
      if (item.path === this.current) return
      // 使用 reLaunch，H5 与微信小程序均可用，无需原生 tabBar 配置
      uni.reLaunch({
        url: '/' + item.path,
      })
    },
    // #ifdef H5
    goAdmin() {
      uni.navigateTo({ url: '/pages/admin/projects/projects' })
    },
    // #endif
  },
}
</script>

<style>
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background-color: rgba(20, 22, 27, 0.85);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.35);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
}

/* 二级页面：移动端隐藏，桌面端显示为顶部导航 */
.tabbar-desktop-only {
  display: none;
}

/* 品牌名：移动端底部导航不显示，仅桌面端顶部导航显示 */
.tabbar-brand {
  display: none;
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16rpx 0 12rpx;
}

.tabbar-item-hover {
  background-color: rgba(24, 27, 34, 0.78);
}

.tabbar-icon {
  font-size: 44rpx;
  line-height: 1;
}

.tabbar-text {
  font-size: 22rpx;
  color: #9aa3b2;
  margin-top: 8rpx;
}

.tabbar-text-active {
  color: #5cb3ff;
}

/* 管理入口：仅桌面端 H5 显示 */
.tabbar-admin {
  display: none;
}

/* #ifdef H5 */
/* 桌面端：tabbar 变为顶部导航栏 */
@media (min-width: 768px) {
  .tabbar {
    top: 0;
    bottom: auto;
    left: 0;
    right: 0;
    height: 64px;
    flex-direction: row;
    align-items: center;
    padding-bottom: 0;
    border-top: none;
    border-bottom: 1px solid #262b36;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  }

  .tabbar-desktop-only {
    display: flex;
  }

  .tabbar-brand {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 32px;
    font-size: 18px;
    font-weight: 700;
    color: #e6e8ee;
    letter-spacing: 1px;
    margin-right: auto;
  }

.tabbar-item {
    flex: 0 0 auto;
    flex-direction: row;
    height: 100%;
    padding: 0 28px;
    cursor: pointer;
  }

  .tabbar-item-hover {
    background-color: rgba(24, 27, 34, 0.78);
  }

  .tabbar-icon {
    font-size: 20px;
    margin-right: 8px;
  }

  .tabbar-text {
    font-size: 15px;
    margin-top: 0;
  }

  .tabbar-admin {
    display: flex;
  }
}
/* #endif */
</style>
