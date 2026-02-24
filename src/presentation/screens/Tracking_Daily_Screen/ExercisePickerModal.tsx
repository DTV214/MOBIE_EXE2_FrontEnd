import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '../../../utils/tailwind';
import { X, ChevronRight, Zap } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useExerciseStore } from '../../viewmodels/useExerciseStore';
import { useDailyLogStore } from '../../viewmodels/useDailyLogStore';

const ExercisePickerModal = ({ isVisible, onClose }: any) => {
  const {
    exerciseTypes,
    fetchExerciseTypes,
    loadMoreExercises,
    addExercise,
    isLoading,
  } = useExerciseStore();
  const { currentLog } = useDailyLogStore();

  const [selectedType, setSelectedType] = useState<any>(null);
  const [duration, setDuration] = useState('30');
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    if (isVisible) fetchExerciseTypes(0);
  }, [isVisible, fetchExerciseTypes]);

  const handleSelectExercise = (item: any) => {
    setSelectedType(item);
    setIsPopupVisible(true);
  };

  const handleSave = async () => {
    if (currentLog?.id && selectedType) {
      try {
        await addExercise({
          duration: parseInt(duration, 10),
          exerciseTypeId: selectedType.id,
          dailyLogId: currentLog.id,
        });
        setIsPopupVisible(false);
        onClose();
      } catch (error) {
        console.error('Save exercise failed', error);
      }
    }
  };

  return (
    <>
      {/* Modal 1: Danh sách các môn tập luyện */}
      <Modal visible={isVisible} animationType="slide">
        <SafeAreaView style={tw`flex-1 bg-white`}>
          <View
            style={tw`p-6 border-b border-gray-100 flex-row justify-between items-center`}
          >
            <Text style={tw`text-xl font-black text-brandDark`}>
              Chọn bài tập
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={exerciseTypes}
            keyExtractor={item => item.id.toString()}
            onEndReached={loadMoreExercises}
            ListFooterComponent={
              isLoading ? (
                <ActivityIndicator color="#3B82F6" style={tw`my-4`} />
              ) : null
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectExercise(item)}
                style={tw`p-5 border-b border-gray-50 flex-row justify-between items-center`}
              >
                <View style={tw`flex-1 pr-4`}>
                  <Text style={tw`font-bold text-brandDark text-lg`}>
                    {item.activity}
                  </Text>
                  <Text style={tw`text-gray-400 text-xs italic`}>
                    {item.examples}
                  </Text>
                </View>
                <ChevronRight size={20} color="#D1D5DB" />
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>

      {/* Modal 2: Popup nhập thời gian tập */}
      <Modal visible={isPopupVisible} transparent animationType="fade">
        <View style={tw`flex-1 bg-black/50 justify-center px-10`}>
          <View style={tw`bg-white rounded-[40px] p-8 shadow-2xl`}>
            <View style={tw`items-center mb-6`}>
              <View
                style={tw`w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-4`}
              >
                <Zap size={32} color="#3B82F6" />
              </View>
              <Text style={tw`text-xl font-black text-brandDark text-center`}>
                {selectedType?.activity}
              </Text>
              <Text style={tw`text-gray-400 text-sm mt-1`}>
                Nhập thời gian tập luyện của bạn
              </Text>
            </View>

            <View
              style={tw`flex-row items-center justify-center bg-gray-50 p-6 rounded-3xl mb-8`}
            >
              <TextInput
                keyboardType="numeric"
                style={tw`text-4xl font-black text-blue-600 mr-3`}
                value={duration}
                onChangeText={setDuration}
                autoFocus
                selectTextOnFocus
              />
              <Text style={tw`text-xl font-bold text-gray-400`}>phút</Text>
            </View>

            <View style={tw`flex-row`}>
              <TouchableOpacity
                onPress={() => setIsPopupVisible(false)}
                style={tw`flex-1 py-4`}
              >
                <Text style={tw`text-gray-400 font-bold text-center`}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={tw`flex-1`}>
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  style={tw`py-4 rounded-2xl shadow-lg`}
                >
                  <Text style={tw`text-white font-bold text-center`}>
                    Lưu bài tập
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ExercisePickerModal;
