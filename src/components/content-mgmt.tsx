import { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Network } from '@/network'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { adminHeaders, clearAdmin } from '@/utils/admin'
import { cn } from '@/lib/utils'

/** 业务请求失败：携带后端 message，便于界面给出真实提示 */
class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

interface DepItem {
  id: string
  name: string
  description?: string
  location?: string
  icon?: string
  sortOrder?: number
}
interface DoctorItem {
  id: string
  name: string
  title?: string
  specialty?: string
  introduction?: string
  avatar?: string
  departmentId?: string
}

async function unwrap(p: Promise<any>): Promise<any> {
  const res: any = await p
  // eslint-disable-next-line no-console
  console.log('API', res)
  // Taro.request 在 4xx/5xx 时不会 reject，需按 statusCode 主动判定失败
  const status: number = res?.statusCode ?? 200
  if (status >= 400) {
    const message: string = res?.data?.message || res?.data?.msg || `请求失败(${status})`
    throw new ApiError(status, message)
  }
  const body = res?.data || {}
  if (body && typeof body === 'object' && body.code && body.code !== 200) {
    throw new ApiError(status, body.msg || body.message || '操作失败')
  }
  return body
}

const B = (label: string, child?: React.ReactNode) => (
  <View className="mb-2 rounded-xl border border-teal-100 bg-white p-3 shadow-sm">
    <Text className="block text-base font-semibold text-gray-800">{label}</Text>
    {child}
  </View>
)

const labelCls = 'block mb-1 text-sm text-gray-500'
const inputWrap = 'mb-3 rounded-xl bg-gray-50 px-3 py-2'

export default function ContentMgmt({ onAuthFail }: { onAuthFail?: () => void } = {}) {
  const [tab, setTab] = useState<'hospital' | 'doctor' | 'dept'>('hospital')

  // 医院内容
  const [intro, setIntro] = useState('')
  const [service, setService] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [hospImage, setHospImage] = useState('')
  const [uploadingHosp, setUploadingHosp] = useState(false)
  const [savingH, setSavingH] = useState(false)

  // 科室
  const [deps, setDeps] = useState<DepItem[]>([])
  const [depName, setDepName] = useState('')
  const [depDesc, setDepDesc] = useState('')
  const [depLoc, setDepLoc] = useState('')

  // 医生
  const [doctors, setDoctors] = useState<DoctorItem[]>([])
  const [docName, setDocName] = useState('')
  const [docTitle, setDocTitle] = useState('')
  const [docIntro, setDocIntro] = useState('')
  const [docAvatar, setDocAvatar] = useState('')
  const [docDept, setDocDept] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    // 挂载时先校验本地登录凭证是否仍有效，失效则直接回登录页
    ;(async () => {
      const h = adminHeaders()
      if (!h['x-admin-phone']) {
        onAuthFail && onAuthFail()
        return
      }
      try {
        await unwrap(Network.request({ url: '/api/content/admin/verify', header: h }))
        refreshAll()
      } catch (e: any) {
        if (e?.status === 401) {
          clearAdmin()
          onAuthFail && onAuthFail()
        } else {
          // 网络异常等不阻塞，仍尝试拉取公开数据
          refreshAll()
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function refreshAll() {
    const [h, d, dc] = await Promise.all([
      unwrap(Network.request({ url: '/api/content/hospital' })),
      unwrap(Network.request({ url: '/api/content/departments' })),
      unwrap(Network.request({ url: '/api/content/doctors' })),
    ])
    const hc = h?.data || {}
    setIntro(hc.intro || '')
    setService(hc.service || '')
    setPhone(hc.phone || '')
    setAddress(hc.address || '')
    setHospImage(hc.image || '')
    setDeps(Array.isArray(d?.data) ? d.data : [])
    setDoctors(Array.isArray(dc?.data) ? dc.data : [])
  }

  function flash(s: string) {
    setMsg(s)
    setTimeout(() => setMsg(''), 2500)
  }

  /** 统一执行写操作：捕获鉴权失败/网络错误，避免“假成功” */
  async function runWrite(task: () => Promise<void>, okMsg: string) {
    try {
      await task()
      flash(okMsg)
      refreshAll()
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log('write failed', e)
      if (e?.status === 401) {
        clearAdmin()
        flash('登录已过期，请重新登录')
        setTimeout(() => onAuthFail && onAuthFail(), 800)
      } else {
        flash(e?.message || '保存失败，请稍后再试')
      }
    }
  }

  async function saveHospital() {
    setSavingH(true)
    try {
      await runWrite(async () => {
        await unwrap(
          Network.request({
            url: '/api/content/admin/hospital',
            method: 'PUT',
            header: adminHeaders(),
            data: { intro, service, phone, address, image: hospImage },
          }),
        )
      }, '医院简介已保存')
    } finally {
      setSavingH(false)
    }
  }

  async function addDept() {
    if (!depName.trim()) return
    await runWrite(async () => {
      await unwrap(
        Network.request({
          url: '/api/content/admin/department',
          method: 'POST',
          header: adminHeaders(),
          data: { name: depName, description: depDesc, location: depLoc },
        }),
      )
    }, '科室已添加')
    setDepName('')
    setDepDesc('')
    setDepLoc('')
  }

  async function updateDept(id: string, patch: Partial<DepItem>) {
    await runWrite(async () => {
      await unwrap(
        Network.request({
          url: `/api/content/admin/department/${id}`,
          method: 'PUT',
          header: adminHeaders(),
          data: patch,
        }),
      )
    }, '科室已更新')
  }

  async function delDept(id: string) {
    await runWrite(async () => {
      await unwrap(
        Network.request({
          url: `/api/content/admin/department/${id}`,
          method: 'DELETE',
          header: adminHeaders(),
        }),
      )
    }, '科室已删除')
  }

  async function pickPhoto() {
    const env = Taro.getEnv()
    const isMini = env === Taro.ENV_TYPE.WEAPP || env === Taro.ENV_TYPE.TT
    if (!isMini) {
      flash('请在小程序内上传照片')
      return
    }
    const res = await Taro.chooseImage({ count: 1, sizeType: ['compressed'] })
    const filePath = res.tempFilePaths[0]
    setUploading(true)
    try {
      const r = await Network.uploadFile({
        url: '/api/content/admin/upload',
        filePath,
        name: 'file',
        header: adminHeaders() as any,
      })
      const rr: any = r as any
      const body = rr?.data?.data || rr?.data
      const url = body?.url || body?.imageUrl
      if (url) {
        setDocAvatar(url)
        flash('照片已上传')
      } else {
        // eslint-disable-next-line no-console
        console.log('upload resp', r)
        flash('照片上传失败')
      }
    } finally {
      setUploading(false)
    }
  }

  async function pickHospitalPhoto() {
    const env = Taro.getEnv()
    const isMini = env === Taro.ENV_TYPE.WEAPP || env === Taro.ENV_TYPE.TT
    if (!isMini) {
      flash('请在小程序内上传照片')
      return
    }
    const res = await Taro.chooseImage({ count: 1, sizeType: ['compressed'] })
    const filePath = res.tempFilePaths[0]
    setUploadingHosp(true)
    try {
      const r = await Network.uploadFile({
        url: '/api/content/admin/upload',
        filePath,
        name: 'file',
        header: adminHeaders() as any,
      })
      const rr: any = r as any
      const body = rr?.data?.data || rr?.data
      const url = body?.url || body?.imageUrl
      if (url) {
        setHospImage(url)
        flash('医院照片已上传，记得点保存')
      } else {
        // eslint-disable-next-line no-console
        console.log('hospital upload resp', r)
        flash('照片上传失败')
      }
    } finally {
      setUploadingHosp(false)
    }
  }

  function resetDocForm() {
    setEditingId(null)
    setDocName('')
    setDocTitle('')
    setDocIntro('')
    setDocAvatar('')
    setDocDept('')
  }

  async function editDoctor(d: DoctorItem) {
    setEditingId(d.id)
    setDocName(d.name)
    setDocTitle(d.title || '')
    setDocIntro(d.introduction || '')
    setDocAvatar(d.avatar || '')
    setDocDept(d.departmentId || '')
  }

  async function saveDoctor() {
    if (!docName.trim()) return
    const data = {
      name: docName,
      title: docTitle,
      introduction: docIntro,
      avatar: docAvatar,
      departmentId: docDept || undefined,
    }
    if (editingId) {
      await runWrite(async () => {
        await unwrap(
          Network.request({
            url: `/api/content/admin/doctor/${editingId}`,
            method: 'PUT',
            header: adminHeaders(),
            data,
          }),
        )
      }, '医生资料已更新')
    } else {
      await runWrite(async () => {
        await unwrap(
          Network.request({
            url: '/api/content/admin/doctor',
            method: 'POST',
            header: adminHeaders(),
            data,
          }),
        )
      }, '医生已添加')
    }
    resetDocForm()
  }

  async function delDoctor(id: string) {
    await runWrite(async () => {
      await unwrap(
        Network.request({
          url: `/api/content/admin/doctor/${id}`,
          method: 'DELETE',
          header: adminHeaders(),
        }),
      )
    }, '医生已删除')
  }

  return (
    <View className="p-3">
      {msg ? (
        <View className="mb-3 rounded-lg bg-teal-50 px-3 py-2">
          <Text className="block text-sm text-teal-700">{msg}</Text>
        </View>
      ) : null}

      <View className="mb-3 flex flex-wrap gap-2">
        {(
          [
            ['hospital', '医院内容'],
            ['doctor', '医生管理'],
            ['dept', '科室管理'],
          ] as const
        ).map(([k, t]) => (
          <View
            key={k}
            className={cn(
              'rounded-full px-4 py-1 text-sm',
              tab === k ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600',
            )}
            onClick={() => setTab(k)}
          >
            <Text className="block">{t}</Text>
          </View>
        ))}
      </View>

      {tab === 'hospital' && (
        <View>
          {B('医院简介', (
            <View className="mt-2">
              <Text className={labelCls}>医院照片</Text>
              <View className="mb-2 flex items-center gap-3">
                {hospImage ? (
                  <Image src={hospImage} className="h-20 w-32 rounded-lg" mode="aspectFill" />
                ) : (
                  <View className="flex h-20 w-32 items-center justify-center rounded-lg bg-gray-100">
                    <Text className="block text-xs text-gray-400">暂无照片</Text>
                  </View>
                )}
                <Button size="sm" variant="outline" onClick={pickHospitalPhoto}>
                  <Text>{uploadingHosp ? '上传中...' : '上传照片'}</Text>
                </Button>
              </View>
              <Text className={labelCls}>简介内容</Text>
              <View className={inputWrap}>
                <Textarea style={{ width: '100%', minHeight: 90 }} maxlength={-1} value={intro} onInput={(e) => setIntro(e.detail.value)} placeholder="输入医院简介（不限字数）" />
              </View>
              <Text className={labelCls}>服务范围</Text>
              <View className={inputWrap}>
                <Textarea style={{ width: '100%', minHeight: 70 }} maxlength={-1} value={service} onInput={(e) => setService(e.detail.value)} placeholder="输入服务范围（不限字数）" />
              </View>
              <Text className={labelCls}>咨询电话</Text>
              <View className={inputWrap}>
                <Input style={{ width: '100%' }} value={phone} onInput={(e) => setPhone(e.detail.value)} placeholder="电话" />
              </View>
              <Text className={labelCls}>地址</Text>
              <View className={inputWrap}>
                <Input style={{ width: '100%' }} value={address} onInput={(e) => setAddress(e.detail.value)} placeholder="地址" />
              </View>
              <Button size="sm" className="w-full" onClick={saveHospital}>
                <Text>{savingH ? '保存中...' : '保存医院简介'}</Text>
              </Button>
            </View>
          ))}
        </View>
      )}

      {tab === 'dept' && (
        <View>
          {B('新增科室', (
            <View className="mt-2">
              <Text className={labelCls}>科室名称</Text>
              <View className={inputWrap}>
                <Input style={{ width: '100%' }} value={depName} onInput={(e) => setDepName(e.detail.value)} placeholder="如：全科" />
              </View>
              <Text className={labelCls}>科室简介</Text>
              <View className={inputWrap}>
                <Textarea style={{ width: '100%', minHeight: 60 }} value={depDesc} onInput={(e) => setDepDesc(e.detail.value)} placeholder="科室简介" />
              </View>
              <Text className={labelCls}>位置</Text>
              <View className={inputWrap}>
                <Input style={{ width: '100%' }} value={depLoc} onInput={(e) => setDepLoc(e.detail.value)} placeholder="如：一楼全科门诊" />
              </View>
              <Button size="sm" className="w-full" onClick={addDept}>
                <Text>添加科室</Text>
              </Button>
            </View>
          ))}

          {deps.map((d) => (
            <View key={d.id} className="mb-2 rounded-xl border border-gray-100 bg-white p-3">
              <View className="mb-1 flex items-center justify-between">
                <Text className="block text-base font-semibold text-gray-800">{d.name}</Text>
                <View className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateDept(d.id, { description: '（已更新）' })}
                  >
                    <Text>编辑</Text>
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => delDept(d.id)}>
                    <Text>删除</Text>
                  </Button>
                </View>
              </View>
              <Text className="block text-sm text-gray-500">{d.description}</Text>
            </View>
          ))}
        </View>
      )}

      {tab === 'doctor' && (
        <View>
          {B(editingId ? '编辑医生' : '新增医生', (
            <View className="mt-2">
              <Text className={labelCls}>姓名</Text>
              <View className={inputWrap}>
                <Input style={{ width: '100%' }} value={docName} onInput={(e) => setDocName(e.detail.value)} placeholder="姓名" />
              </View>
              <Text className={labelCls}>职称</Text>
              <View className={inputWrap}>
                <Input style={{ width: '100%' }} value={docTitle} onInput={(e) => setDocTitle(e.detail.value)} placeholder="如：主治医师" />
              </View>
              <Text className={labelCls}>简介</Text>
              <View className={inputWrap}>
                <Textarea style={{ width: '100%', minHeight: 60 }} value={docIntro} onInput={(e) => setDocIntro(e.detail.value)} placeholder="医生简介" />
              </View>
              <Text className={labelCls}>所属科室</Text>
              <View className={inputWrap}>
                <Input style={{ width: '100%' }} value={docDept} onInput={(e) => setDocDept(e.detail.value)} placeholder="科室ID（可选）" />
              </View>
              <Text className={labelCls}>照片</Text>
              <View className="mb-2 flex items-center gap-3">
                {docAvatar ? (
                  <Image src={docAvatar} className="h-14 w-14 rounded-full" mode="aspectFill" />
                ) : (
                  <View className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                    <Text className="block text-gray-400">无</Text>
                  </View>
                )}
                <Button size="sm" variant="outline" onClick={pickPhoto}>
                  <Text>{uploading ? '上传中...' : '上传照片'}</Text>
                </Button>
              </View>
              <View className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={saveDoctor}>
                  <Text>保存医生</Text>
                </Button>
                {editingId ? (
                  <Button size="sm" variant="outline" onClick={resetDocForm}>
                    <Text>取消</Text>
                  </Button>
                ) : null}
              </View>
            </View>
          ))}

          {doctors.map((d) => (
            <View key={d.id} className="mb-2 flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3">
              {d.avatar ? (
                <Image src={d.avatar} className="h-12 w-12 rounded-full" mode="aspectFill" />
              ) : (
                <View className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
                  <Text className="block text-teal-600">{d.name ? d.name[0] : ''}</Text>
                </View>
              )}
              <View className="min-w-0 flex-1">
                <View className="flex items-center gap-2">
                  <Text className="block text-base font-semibold text-gray-800">{d.name}</Text>
                  <Badge variant="outline">{d.title || '医师'}</Badge>
                </View>
                <Text className="mt-1 block text-sm text-gray-500">{d.introduction}</Text>
              </View>
              <View className="flex flex-col gap-1.5">
                <Button size="sm" variant="outline" onClick={() => editDoctor(d)}>
                  <Text>编辑</Text>
                </Button>
                <Button size="sm" variant="destructive" onClick={() => delDoctor(d.id)}>
                  <Text>删除</Text>
                </Button>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}