// src/utils/audioPlayerSimple.ts
import Sound from 'react-native-sound';

// Initialize sound library
Sound.setCategory('Playback', true);

export class SimpleAudioPlayer {
  private sound: Sound | null = null;
  private isPlaying = false;

  // Simple base64 audio player using blob URL approach
  async playFromBase64(audioBase64: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.stop();

        console.log('🎵 [SIMPLE] Playing audio from base64, size:', audioBase64.length);

        // Try creating temporary object URL approach
        const audioData = `data:audio/mpeg;base64,${audioBase64}`;
        
        // For React Native, we'll try to pass the data URL directly
        // Some versions of react-native-sound support data URLs
        this.sound = new Sound(audioData, '', (error) => {
          if (error) {
            console.error('❌ [SIMPLE] Simple audio player failed:', error);
            // Fallback to showing user a message that audio is not supported
            reject(new Error('Audio playback not supported on this device'));
            return;
          }

          console.log('✅ [SIMPLE] Audio loaded successfully');
          this.playLoadedSound(resolve, reject);
        });

      } catch (error) {
        console.error('❌ [SIMPLE] Error in simple audio playback:', error);
        reject(error);
      }
    });
  }

  private playLoadedSound(resolve: () => void, reject: (error: any) => void): void {
    if (!this.sound) {
      reject(new Error('No sound object'));
      return;
    }

    this.isPlaying = true;
    this.sound.play((success) => {
      this.isPlaying = false;
      
      if (success) {
        console.log('✅ [SIMPLE] Audio playback completed');
        resolve();
      } else {
        console.error('❌ [SIMPLE] Audio playback failed');
        reject(new Error('Playback failed'));
      }
    });
  }

  stop(): void {
    if (this.sound) {
      this.sound.stop();
      this.sound.release();
      this.sound = null;
      this.isPlaying = false;
      console.log('⏹️ [SIMPLE] Audio stopped');
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  setVolume(volume: number): void {
    if (this.sound) {
      this.sound.setVolume(volume);
    }
  }
}

// Export both complex and simple players
export const simpleAudioPlayer = new SimpleAudioPlayer();

// Helper function that tries file-based player first, falls back to simple
export const playAIAudioFallback = async (audioBase64: string): Promise<void> => {
  try {
    // First try the complex file-based player
    const { playAIAudio } = await import('./audioPlayer');
    await playAIAudio(audioBase64);
  } catch (fileError) {
    const fileErrorMessage = fileError instanceof Error ? fileError.message : 'Unknown error';
    console.warn('File-based audio player failed, trying simple player:', fileErrorMessage);
    
    try {
      // Fallback to simple player
      await simpleAudioPlayer.playFromBase64(audioBase64);
    } catch (simpleError) {
      const simpleErrorMessage = simpleError instanceof Error ? simpleError.message : 'Unknown error';
      console.error('Both audio players failed:', simpleErrorMessage);
      // Show user-friendly message
      throw new Error('Không thể phát âm thanh trên thiết bị này. Vui lòng thử lại sau.');
    }
  }
};