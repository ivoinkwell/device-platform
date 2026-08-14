/**
 * 模拟数据（后端未启动时的占位数据）
 * 字段结构与后端接口一致，config.js 中 USE_MOCK = true 时使用
 */
function delay(data, ms = 400) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), ms)
  })
}

// 手机参数：设备列表 + 参数
const DEVICES = [
  {
    id: 1, brand: '小米', model: '15 Ultra', updatedAt: '2026-08-14 09:14:02', groupCount: 4, itemCount: 8,
    groups: [
      { title: '基本信息', items: [{ label: '品牌', value: '小米' }, { label: '型号', value: '15 Ultra' }, { label: '处理器', value: '骁龙8至尊版' }] },
      { title: '屏幕', items: [{ label: '屏幕', value: '6.73英寸 2K 120Hz' }, { label: '亮度', value: '峰值 3200nit' }] },
      { title: '电池', items: [{ label: '电池容量', value: '6000mAh' }, { label: '充电', value: '90W 有线' }] },
      { title: '其他', items: [{ label: '重量', value: '226g' }] },
    ],
  },
  {
    id: 2, brand: '苹果', model: 'iPhone 16 Pro Max', updatedAt: '2026-08-14 09:14:02', groupCount: 4, itemCount: 8,
    groups: [
      { title: '基本信息', items: [{ label: '品牌', value: 'Apple' }, { label: '型号', value: 'iPhone 16 Pro Max' }, { label: '处理器', value: 'A18 Pro' }] },
      { title: '屏幕', items: [{ label: '屏幕', value: '6.9英寸 120Hz' }, { label: '亮度', value: '峰值 2000nit' }] },
      { title: '电池', items: [{ label: '电池容量', value: '4685mAh' }, { label: '充电', value: '45W 有线 · MagSafe' }] },
      { title: '系统', items: [{ label: '操作系统', value: 'iOS 18' }] },
    ],
  },
  {
    id: 3, brand: '华为', model: 'Mate 70 Pro', updatedAt: '2026-08-14 09:14:02', groupCount: 4, itemCount: 8,
    groups: [
      { title: '基本信息', items: [{ label: '品牌', value: '华为' }, { label: '型号', value: 'Mate 70 Pro' }, { label: '处理器', value: '麒麟9020' }] },
      { title: '屏幕', items: [{ label: '屏幕', value: '6.9英寸 1.5K 120Hz' }, { label: '亮度', value: '峰值 2500nit' }] },
      { title: '电池', items: [{ label: '电池容量', value: '5500mAh' }, { label: '充电', value: '100W 有线' }] },
      { title: '系统', items: [{ label: '操作系统', value: 'HarmonyOS 5' }] },
    ],
  },
]

export function mockDeviceList() {
  return delay(DEVICES.map(({ groups, ...rest }) => rest))
}

export function mockDeviceInfo(id) {
  const device = DEVICES.find((d) => d.id === Number(id))
  return device ? delay(device) : delay(null)
}

// 测试项目（测试名称）+ 机型记录
const PROJECTS = [
  { id: 1, name: '续航测试', remark: '5小时重度使用模拟', createdAt: '2026-08-14 09:14:02', recordCount: 2 },
  { id: 2, name: '充电测试', remark: '0-100 充电记录', createdAt: '2026-08-14 09:14:02', recordCount: 2 },
  { id: 3, name: '信号测试', remark: '弱场环境测试', createdAt: '2026-08-14 09:14:02', recordCount: 1 },
]

export function mockProjectList() {
  return delay(PROJECTS)
}

const RECORDS = {
  1: [
    { id: 1, device: DEVICES[0], params: [{ label: '剩余电量', value: '78%' }, { label: '机身温度', value: '41.2℃' }, { label: '续航时长', value: '8小时42分' }, { label: '结论', value: '通过' }] },
    { id: 2, device: DEVICES[1], params: [{ label: '剩余电量', value: '72%' }, { label: '机身温度', value: '42.5℃' }, { label: '续航时长', value: '7小时58分' }, { label: '结论', value: '通过' }] },
  ],
  2: [
    { id: 3, device: DEVICES[0], params: [{ label: '峰值功率', value: '90W' }, { label: '30分钟充电', value: '95%' }, { label: '充满用时', value: '32分钟' }, { label: '结论', value: '通过' }] },
    { id: 4, device: DEVICES[1], params: [{ label: '峰值功率', value: '45W' }, { label: '30分钟充电', value: '82%' }, { label: '充满用时', value: '58分钟' }, { label: '结论', value: '通过' }] },
  ],
  3: [
    { id: 5, device: DEVICES[2], params: [{ label: '5G 下载', value: '986Mbps' }, { label: '通话掉线率', value: '0.3%' }, { label: 'GPS 精度', value: '1.6m' }, { label: '结论', value: '通过' }] },
  ],
}

export function mockProjectDetail(id) {
  const project = PROJECTS.find((p) => p.id === Number(id))
  if (!project) return delay(null)
  return delay({ ...project, records: RECORDS[id] || [] })
}
