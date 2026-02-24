// src/utils/audioUtils.ts
import { Alert } from 'react-native';
import Sound from 'react-native-sound';

class AudioManager {
  private currentSound: Sound | null = null;

  // Play audio from base64 string
  async playBase64Audio(base64Data: string): Promise<void> {
    try {
      // Stop current audio if playing
      this.stopCurrentAudio();

      console.log('🔊 Playing AI audio response...');

      // Create data URI for the audio
      const audioUri = `data:audio/wav;base64,${base64Data}`;

      // Create and configure sound
      const sound = new Sound(audioUri, '', (error) => {
        if (error) {
          console.error('❌ Audio load error:', error);
          Alert.alert('Lỗi', 'Không thể phát âm thanh từ AI');
          return;
        }

        // Play the audio
        sound.play((success) => {
          if (success) {
            console.log('✅ Audio playback completed');
          } else {
            console.error('❌ Audio playback failed');
          }
          
          // Release the sound resource
          sound.release();
          if (this.currentSound === sound) {
            this.currentSound = null;
          }
        });
      });

      this.currentSound = sound;

    } catch (error) {
      console.error('❌ Audio playback error:', error);
      Alert.alert('Lỗi', 'Không thể phát âm thanh');
    }
  }

  // Stop currently playing audio
  stopCurrentAudio(): void {
    if (this.currentSound) {
      this.currentSound.stop(() => {
        this.currentSound?.release();
        this.currentSound = null;
        console.log('⏹️ Audio stopped');
      });
    }
  }

  // Check if audio is currently playing
  isPlaying(): boolean {
    return this.currentSound !== null;
  }

  // Pause current audio
  pauseCurrentAudio(): void {
    if (this.currentSound) {
      this.currentSound.pause();
      console.log('⏸️ Audio paused');
    }
  }

  // Resume paused audio
  resumeCurrentAudio(): void {
    if (this.currentSound) {
      this.currentSound.play();
      console.log('▶️ Audio resumed');
    }
  }
}

// Export singleton instance
export const audioManager = new AudioManager();

// Utility functions
export const playAIAudio = (base64Data: string) => {
  return audioManager.playBase64Audio(base64Data);
};

export const stopAIAudio = () => {
  return audioManager.stopCurrentAudio();
};

export const isAudioPlaying = () => {
  return audioManager.isPlaying();
};