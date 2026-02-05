import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { useDailyLogStore } from '../../viewmodels/useDailyLogStore';
import {
  CalendarDays,
  Plus,
  Flame,
  Footprints,
  Droplets,
  ChevronRight,
  TrendingUp,
  Info,
  Utensils,
  X,
  Clock,
  MessageSquare,
  Edit2,
  Trash2,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MealType } from '../../../domain/entities/MealLog';

const DailyLogScreen = () => {
  const navigation = useNavigation<any>();
  const {
    currentLog,
    mealLogs,
    selectedDate,
    isLoading,
    fetchLogByDate,
    initializeLog,
    setSelectedDate,
    addMealLog,
    updateMealLog,
    deleteMealLog,
  } = useDailyLogStore();

  // --- UI State ---
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMealId, setEditingMealId] = useState<number | null>(null);

  // --- Custom Time Picker State (Thay thế native picker) ---
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [tempHour, setTempHour] = useState('08');
  const [tempMinute, setTempMinute] = useState('00');

  // --- Form State ---
  const [formMealType, setFormMealType] = useState<MealType>(
    MealType.BREAKFAST,
  );
  const [formNotes, setFormNotes] = useState('');

  useEffect(() => {
    fetchLogByDate(selectedDate);
  }, [selectedDate, fetchLogByDate]);

  const totalMealCalories = useMemo(() => {
    return mealLogs.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0);
  }, [mealLogs]);

  // Helper đảm bảo luôn có số 0 ở đầu
  const pad = (n: string | number) => n.toString().padStart(2, '0');

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingMealId(null);
    setFormMealType(MealType.BREAKFAST);
    setFormNotes('');
    const now = new Date();
    setTempHour(pad(now.getHours()));
    setTempMinute(pad(now.getMinutes()));
    setModalVisible(true);
  };

  const openEditModal = (meal: any) => {
    setIsEditMode(true);
    setEditingMealId(meal.id);
    setFormMealType(meal.mealType);
    setFormNotes(meal.notes || '');
    // Tách giờ từ chuỗi HH:mm:ss của Backend
    const [h, m] = meal.loggedTime.split(':');
    setTempHour(pad(h));
    setTempMinute(pad(m));
    setModalVisible(true);
  };

  const handleSubmitMeal = async () => {
    try {
      // Ép kiểu format chuẩn HH:mm:00 để Backend không lỗi 500
      const finalTime = `${pad(tempHour)}:${pad(tempMinute)}:00`;
      const params = {
        mealType: formMealType,
        notes: formNotes,
        loggedTime: finalTime,
      };

      if (isEditMode && editingMealId) {
        await updateMealLog(editingMealId, params);
        Alert.alert('Thành công', 'Đã cập nhật bữa ăn.');
      } else {
        await addMealLog(params);
        Alert.alert('Thành công', 'Đã thêm bữa ăn mới!');
      }
      setModalVisible(false);
    } catch (error: any) {
      // Hiển thị lỗi Null hoặc lỗi parse từ Server
      Alert.alert('Lỗi', error.response?.data?.message || error.message);
    }
  };

  const renderHorizontalCalendar = () => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-4`}
        style={tw`flex-row mb-6`}
      >
        {dates.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const isSelected = dateStr === selectedDate;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedDate(dateStr)}
              style={tw`items-center justify-center w-14 h-20 mx-1.5 rounded-3xl ${
                isSelected ? 'bg-primary shadow-lg' : 'bg-gray-50'
              }`}
            >
              <Text
                style={tw`text-[10px] uppercase font-bold ${
                  isSelected ? 'text-white/80' : 'text-gray-400'
                }`}
              >
                {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
              </Text>
              <Text
                style={tw`text-lg font-black ${
                  isSelected ? 'text-white' : 'text-brandDark'
                }`}
              >
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  if (isLoading && !isModalVisible) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#7FB069" />
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={tw`px-6 pt-4 flex-row justify-between items-center`}>
        <View>
          <Text style={tw`text-gray-400 text-sm font-medium italic`}>
            Stay Healthy,
          </Text>
          <Text style={tw`text-2xl font-black text-brandDark`}>
            Nhật Ký Sức Khỏe
          </Text>
        </View>
        <TouchableOpacity style={tw`bg-gray-100 p-3 rounded-2xl`}>
          <CalendarDays size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`flex-1 mt-6`} showsVerticalScrollIndicator={false}>
        {renderHorizontalCalendar()}

        {/* Debug & Info Area - Dùng icon Info */}
        <View
          style={tw`mx-6 mb-4 p-2 bg-blue-50 rounded-lg border border-blue-100 flex-row items-center`}
        >
          <Info size={14} color="#1D4ED8" />
          <Text style={tw`ml-2 text-[10px] text-blue-700 font-bold`}>
            LOG ID: {currentLog?.id || 'N/A'} | CALO: {totalMealCalories} kcal
          </Text>
        </View>

        {!currentLog ? (
          <View style={tw`px-6 py-10 items-center`}>
            <Text style={tw`text-6xl mb-6`}>📝</Text>
            <TouchableOpacity onPress={() => initializeLog(selectedDate)}>
              <LinearGradient
                colors={['#7FB069', '#6A9A5A']}
                style={tw`flex-row items-center px-8 py-4 rounded-2xl shadow-lg`}
              >
                <Plus size={20} color="white" style={tw`mr-2`} />
                <Text style={tw`text-white font-bold text-lg`}>
                  Bắt đầu ngày mới
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={tw`px-6`}>
            {/* Calories Card */}
            <LinearGradient
              colors={['#1F2937', '#111827']}
              style={tw`p-6 rounded-[32px] shadow-xl mb-6`}
            >
              <View style={tw`flex-row justify-between items-center mb-6`}>
                <View>
                  <Text style={tw`text-gray-400 text-xs font-bold uppercase`}>
                    Calo Còn Lại
                  </Text>
                  <Text style={tw`text-white text-3xl font-black`}>
                    {(currentLog.remainingCalories || 0).toLocaleString()}
                  </Text>
                </View>
                <View style={tw`bg-primary/20 p-3 rounded-2xl`}>
                  <Flame size={28} color="#7FB069" />
                </View>
              </View>
              <View
                style={tw`w-full h-2 bg-white/10 rounded-full mb-4 overflow-hidden`}
              >
                <View
                  style={[
                    tw`h-full bg-primary rounded-full`,
                    {
                      width: `${Math.min(
                        ((currentLog.totalCaloriesIn || 0) /
                          (currentLog.targetCalories || 1)) *
                          100,
                        100,
                      )}%`,
                    },
                  ]}
                />
              </View>
            </LinearGradient>

            {/* Quick Stats Area - Dùng icon Footprints, Droplets */}
            <View style={tw`flex-row justify-between mb-6`}>
              <StatCard
                icon={<Footprints size={20} color="#3B82F6" />}
                label="Bước chân"
                value={currentLog.steps || 0}
                unit="steps"
                color="blue"
              />
              <StatCard
                icon={<Droplets size={20} color="#06B6D4" />}
                label="Nước uống"
                value="1.2"
                unit="L"
                color="cyan"
              />
            </View>

            {/* Nutrition Area - Dùng icon TrendingUp */}
            <View style={tw`bg-gray-50 p-5 rounded-[24px] mb-6`}>
              <View style={tw`flex-row items-center mb-4`}>
                <TrendingUp size={18} color="#7FB069" />
                <Text style={tw`ml-2 font-bold text-brandDark`}>
                  Dinh dưỡng hôm nay
                </Text>
              </View>
              <View style={tw`flex-row justify-between`}>
                <NutrientMiniProgress
                  label="Protein"
                  value={currentLog.totalProtein || 0}
                  target={150}
                  color="#7FB069"
                />
                <NutrientMiniProgress
                  label="Carbs"
                  value={currentLog.totalCarbs || 0}
                  target={200}
                  color="#3B82F6"
                />
                <NutrientMiniProgress
                  label="Fat"
                  value={currentLog.totalFat || 0}
                  target={60}
                  color="#F97316"
                />
              </View>
            </View>

            {/* Meal List */}
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-black text-brandDark`}>
                Bữa ăn chi tiết
              </Text>
              <TouchableOpacity
                onPress={openAddModal}
                style={tw`bg-primary/10 p-2 rounded-full`}
              >
                <Plus size={20} color="#7FB069" />
              </TouchableOpacity>
            </View>

            {mealLogs.length === 0 ? (
              <TouchableOpacity
                onPress={openAddModal}
                style={tw`bg-gray-50 p-8 rounded-3xl items-center border-2 border-dashed border-gray-200`}
              >
                <Utensils size={32} color="#9CA3AF" />
                <Text style={tw`text-gray-400 font-bold mt-2`}>
                  Bấm dấu cộng để thêm bữa ăn
                </Text>
              </TouchableOpacity>
            ) : (
              mealLogs.map(meal => (
                <View
                  key={meal.id}
                  style={tw`bg-gray-50 p-4 rounded-3xl mb-3 flex-row items-center shadow-sm`}
                >
                  <TouchableOpacity
                    style={tw`flex-row items-center flex-1`}
                    onPress={() =>
                      navigation.navigate('MealTracking', {
                        mealLogId: meal.id,
                        type: meal.mealType,
                      })
                    }
                  >
                    <View
                      style={tw`w-10 h-10 bg-white rounded-xl items-center justify-center mr-3 shadow-sm`}
                    >
                      <Utensils size={18} color="#7FB069" />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-brandDark font-bold`}>
                        {meal.mealType} - {meal.loggedTime}
                      </Text>
                      <Text
                        style={tw`text-gray-400 text-[10px]`}
                        numberOfLines={1}
                      >
                        {meal.notes || 'Không có ghi chú'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View
                    style={tw`flex-row items-center ml-2 border-l border-gray-200 pl-2`}
                  >
                    <TouchableOpacity
                      onPress={() => openEditModal(meal)}
                      style={tw`p-2 mr-1`}
                    >
                      <Edit2 size={16} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert('Xác nhận', 'Xóa nhật ký này?', [
                          { text: 'Hủy' },
                          {
                            text: 'Xóa',
                            style: 'destructive',
                            onPress: () => deleteMealLog(meal.id),
                          },
                        ]);
                      }}
                      style={tw`p-2`}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            <View style={tw`h-10`} />
          </View>
        )}
      </ScrollView>

      {/* --- FORM MODAL (Add & Update) --- */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={tw`flex-1 bg-black/50 justify-end`}>
          <View style={tw`bg-white rounded-t-[40px] p-8 pb-10 shadow-2xl`}>
            <View style={tw`flex-row justify-between items-center mb-8`}>
              <Text style={tw`text-xl font-black text-brandDark`}>
                {isEditMode ? 'Cập nhật bữa ăn' : 'Thêm bữa ăn mới'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={tw`p-2 bg-gray-100 rounded-full`}
              >
                <X size={20} color="#1F2937" />
              </TouchableOpacity>
            </View>

            {/* Loại Bữa Ăn */}
            <Text
              style={tw`text-gray-400 font-bold text-[10px] uppercase mb-3`}
            >
              Loại bữa ăn
            </Text>
            <View style={tw`flex-row flex-wrap mb-6`}>
              {[
                MealType.BREAKFAST,
                MealType.LUNCH,
                MealType.DINNER,
                MealType.SNACK,
              ].map(type => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFormMealType(type)}
                  style={tw`px-4 py-2 rounded-xl mr-2 mb-2 border ${
                    formMealType === type
                      ? 'bg-primary border-primary'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text
                    style={tw`font-bold text-xs ${
                      formMealType === type ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom JS Time Picker (Thay thế Clock Picker Native) */}
            <Text
              style={tw`text-gray-400 font-bold text-[10px] uppercase mb-3`}
            >
              Thời gian ghi nhận (Nhấn để chọn)
            </Text>
            <TouchableOpacity
              onPress={() => setTimePickerVisible(!isTimePickerVisible)}
              style={tw`flex-row items-center bg-gray-50 p-4 rounded-2xl mb-4 border border-gray-100`}
            >
              <Clock size={18} color="#6B7280" />
              <Text style={tw`flex-1 ml-3 font-bold text-brandDark text-lg`}>
                {pad(tempHour)} : {pad(tempMinute)}
              </Text>
              <ChevronRight size={16} color="#9CA3AF" />
            </TouchableOpacity>

            {isTimePickerVisible && (
              <View
                style={tw`bg-gray-50 p-4 rounded-2xl mb-6 flex-row justify-around items-center`}
              >
                <View style={tw`items-center`}>
                  <Text style={tw`text-[10px] text-gray-400 mb-2`}>GIỜ</Text>
                  <TextInput
                    keyboardType="numeric"
                    maxLength={2}
                    value={tempHour}
                    onChangeText={setTempHour}
                    style={tw`bg-white px-4 py-2 rounded-lg font-bold text-lg text-brandDark border border-gray-200`}
                  />
                </View>
                <Text style={tw`text-xl font-bold mt-4`}>:</Text>
                <View style={tw`items-center`}>
                  <Text style={tw`text-[10px] text-gray-400 mb-2`}>PHÚT</Text>
                  <TextInput
                    keyboardType="numeric"
                    maxLength={2}
                    value={tempMinute}
                    onChangeText={setTempMinute}
                    style={tw`bg-white px-4 py-2 rounded-lg font-bold text-lg text-brandDark border border-gray-200`}
                  />
                </View>
              </View>
            )}

            {/* Ghi chú */}
            <Text
              style={tw`text-gray-400 font-bold text-[10px] uppercase mb-3`}
            >
              Ghi chú (Tùy chọn)
            </Text>
            <View
              style={tw`flex-row items-start bg-gray-50 p-4 rounded-2xl mb-8`}
            >
              <MessageSquare size={18} color="#6B7280" style={tw`mt-1`} />
              <TextInput
                multiline
                numberOfLines={2}
                style={tw`flex-1 ml-3 text-brandDark min-h-[50px]`}
                placeholder="Cảm nhận hôm nay?"
                value={formNotes}
                onChangeText={setFormNotes}
              />
            </View>

            <TouchableOpacity onPress={handleSubmitMeal} disabled={isLoading}>
              <LinearGradient
                colors={['#7FB069', '#6A9A5A']}
                style={tw`py-4 rounded-2xl items-center shadow-lg ${
                  isLoading ? 'opacity-50' : ''
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={tw`text-white font-bold text-lg`}>
                    {isEditMode ? 'Lưu thay đổi' : 'Khởi tạo ngay'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// --- Sub-components (Đã sửa lỗi Unused Area) ---
const StatCard = ({ icon, label, value, unit, color }: any) => (
  <View
    style={tw`bg-white border border-gray-100 p-4 rounded-3xl w-[48%] shadow-sm`}
  >
    <View
      style={tw`bg-${color}-50 w-10 h-10 rounded-xl items-center justify-center mb-3`}
    >
      {icon}
    </View>
    <Text style={tw`text-gray-400 text-xs font-medium`}>{label}</Text>
    <View style={tw`flex-row items-baseline`}>
      <Text style={tw`text-brandDark text-lg font-black mr-1`}>
        {value || 0}
      </Text>
      <Text style={tw`text-gray-400 text-[10px] font-bold uppercase`}>
        {unit}
      </Text>
    </View>
  </View>
);

const NutrientMiniProgress = ({ label, value, target, color }: any) => (
  <View style={tw`w-[30%]`}>
    <Text
      style={tw`text-[10px] text-gray-400 font-bold mb-1 uppercase text-center`}
    >
      {label}
    </Text>
    <View style={tw`h-1 bg-gray-200 rounded-full overflow-hidden`}>
      <View
        style={[
          tw`h-full rounded-full`,
          {
            backgroundColor: color,
            width: `${Math.min((value / (target || 1)) * 100, 100)}%`,
          },
        ]}
      />
    </View>
    <Text style={tw`text-center text-xs font-bold mt-1 text-brandDark`}>
      {value || 0}g
    </Text>
  </View>
);

export default DailyLogScreen;
