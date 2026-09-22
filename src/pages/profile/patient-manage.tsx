import { useState, useCallback, useEffect } from 'react'
import SupportFooter from '@/components/support-footer'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Plus, User, Phone, CreditCard, Trash2 } from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { getPatients, savePatient, deletePatient, type Patient } from '@/data/mock-data'

const PatientManagePage = () => {
  const [patients, setPatients] = useState<Patient[]>(() => getPatients())
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formIdCard, setFormIdCard] = useState('')
  const [formRelation, setFormRelation] = useState('本人')

  const refreshList = useCallback(() => {
    setPatients(getPatients())
  }, [])

  useEffect(() => {
    refreshList()
  }, [refreshList])

  const handleAdd = () => {
    setEditingPatient(null)
    setFormName('')
    setFormPhone('')
    setFormIdCard('')
    setFormRelation('本人')
    setShowAddDialog(true)
  }

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
    setFormName(patient.name)
    setFormPhone(patient.phone)
    setFormIdCard(patient.idCard)
    setFormRelation(patient.relation)
    setShowAddDialog(true)
  }

  const handleSave = () => {
    if (!formName.trim()) {
      Taro.showToast({ title: '请输入姓名', icon: 'none' })
      return
    }
    if (!/^1\d{10}$/.test(formPhone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }
    if (!/^\d{17}[\dXx]$/.test(formIdCard)) {
      Taro.showToast({ title: '请输入正确的身份证号', icon: 'none' })
      return
    }

    const patient: Patient = {
      id: editingPatient?.id || `p-${Date.now()}`,
      name: formName.trim(),
      phone: formPhone,
      idCard: formIdCard,
      relation: formRelation,
      isDefault: editingPatient?.isDefault || false,
    }

    savePatient(patient)
    refreshList()
    setShowAddDialog(false)
    Taro.showToast({ title: '保存成功', icon: 'success' })
  }

  const handleDelete = (patientId: string) => {
    Taro.showModal({
      title: '删除就诊人',
      content: '确定要删除这个就诊人吗？',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          deletePatient(patientId)
          refreshList()
          Taro.showToast({ title: '已删除', icon: 'success' })
        }
      },
    })
  }

  const relations = ['本人', '配偶', '父亲', '母亲', '子女', '其他']

  return (
    <ScrollView scrollY className="h-full bg-teal-50">
      <View className="px-4 pt-4 pb-6">
        {patients.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-16">
            <User size={48} color="#CBD5E1" />
            <Text className="text-base text-slate-400 block mt-4 text-center">
              暂无就诊人信息
            </Text>
            <Text className="text-sm text-slate-400 block mt-1 text-center">
              点击下方按钮添加就诊人
            </Text>
          </View>
        ) : (
          <View className="flex flex-col gap-3">
            {patients.map((patient) => (
              <Card key={patient.id} className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <View className="flex flex-row items-start justify-between">
                    <View className="flex-1">
                      <View className="flex flex-row items-center gap-2">
                        <Text className="text-lg font-semibold text-slate-800 block">
                          {patient.name}
                        </Text>
                        <View className="bg-teal-50 px-2 py-1 rounded-full">
                          <Text className="text-xs text-teal-700 block">
                            {patient.relation}
                          </Text>
                        </View>
                      </View>
                      <View className="flex flex-row items-center gap-2 mt-2">
                        <Phone size={13} color="#94A3B8" />
                        <Text className="text-sm text-slate-600 block">
                          {patient.phone}
                        </Text>
                      </View>
                      <View className="flex flex-row items-center gap-2 mt-1">
                        <CreditCard size={13} color="#94A3B8" />
                        <Text className="text-sm text-slate-500 block">
                          {patient.idCard.replace(/^(.{6})(.+)(.{4})$/, '$1********$3')}
                        </Text>
                      </View>
                    </View>
                    <View className="flex flex-col gap-2 ml-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-teal-200 text-teal-600 rounded-lg"
                        onClick={() => handleEdit(patient)}
                      >
                        <Text className="text-xs text-teal-600 block">编辑</Text>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-500 rounded-lg"
                        onClick={() => handleDelete(patient.id)}
                      >
                        <Trash2 size={12} color="#EF4444" />
                        <Text className="text-xs text-red-500 block">删除</Text>
                      </Button>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}

        {/* 添加按钮 */}
        <View className="mt-4">
          <Button
            className="w-full h-12 bg-teal-600 text-white text-lg font-semibold rounded-xl"
            onClick={handleAdd}
          >
            <Plus size={18} color="#ffffff" />
            <Text className="text-lg text-white font-semibold block">添加就诊人</Text>
          </Button>
        </View>
      </View>

      {/* 添加/编辑弹窗 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              <Text className="text-lg font-bold text-slate-800 block">
                {editingPatient ? '编辑就诊人' : '添加就诊人'}
              </Text>
            </DialogTitle>
          </DialogHeader>

          <View className="flex flex-col gap-4 py-2">
            <View>
              <Label className="text-sm text-slate-600 mb-2 block">姓名</Label>
              <View className="bg-slate-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="请输入姓名"
                  value={formName}
                  onInput={(e) => setFormName(e.detail.value)}
                />
              </View>
            </View>

            <View>
              <Label className="text-sm text-slate-600 mb-2 block">手机号</Label>
              <View className="bg-slate-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="请输入手机号"
                  type="number"
                  maxlength={11}
                  value={formPhone}
                  onInput={(e) => setFormPhone(e.detail.value)}
                />
              </View>
            </View>

            <View>
              <Label className="text-sm text-slate-600 mb-2 block">身份证号</Label>
              <View className="bg-slate-50 rounded-xl px-4 py-3">
                <Input
                  className="w-full bg-transparent text-base"
                  placeholder="请输入身份证号"
                  value={formIdCard}
                  onInput={(e) => setFormIdCard(e.detail.value)}
                />
              </View>
            </View>

            <View>
              <Label className="text-sm text-slate-600 mb-2 block">与本人关系</Label>
              <View className="flex flex-row gap-2 flex-wrap">
                {relations.map((rel) => (
                  <View
                    key={rel}
                    className={`px-4 py-2 rounded-full active:opacity-80 ${
                      formRelation === rel
                        ? 'bg-teal-600'
                        : 'bg-slate-100'
                    }`}
                    onClick={() => setFormRelation(rel)}
                  >
                    <Text
                      className={`text-sm block ${
                        formRelation === rel ? 'text-white' : 'text-slate-600'
                      }`}
                    >
                      {rel}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <DialogFooter className="flex flex-row gap-3 mt-2">
            <Button
              variant="outline"
              className="flex-1 h-11 rounded-xl border-slate-200"
              onClick={() => setShowAddDialog(false)}
            >
              <Text className="text-base text-slate-600 block">取消</Text>
            </Button>
            <Button
              className="flex-1 h-11 bg-teal-600 text-white rounded-xl"
              onClick={handleSave}
            >
              <Text className="text-base text-white font-semibold block">保存</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SupportFooter />
    </ScrollView>
  )
}

export default PatientManagePage
