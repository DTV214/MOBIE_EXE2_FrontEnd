// src/utils/audioPlayer.ts
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';

// Initialize sound library
Sound.setCategory('Playback', true);

export class AudioPlayer {
  private sound: Sound | null = null;
  private isPlaying = false;
  private tempFilePath: string | null = null;

  // Play audio from base64 string
  async playFromBase64(audioBase64: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Stop any currently playing audio
        this.stop();

        console.log('🎵 Playing audio from base64, size:', audioBase64.length);

        // Create temporary file path
        const fileName = `temp_audio_${Date.now()}.mp3`;
        this.tempFilePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

        // Write base64 to file
        try {
          await RNFS.writeFile(this.tempFilePath, audioBase64, 'base64');
          console.log('✅ Audio file created:', this.tempFilePath);
        } catch (writeError) {
          console.error('❌ Failed to write audio file:', writeError);
          reject(writeError);
          return;
        }

        // Create sound object from file
        this.sound = new Sound(this.tempFilePath, '', (error) => {
          if (error) {
            console.error('❌ Failed to load audio file:', error);
            this.cleanupTempFile();
            reject(error);
            return;
          }

          console.log('✅ Audio loaded successfully from file');
          this.playLoadedSound(resolve, reject);
        });

      } catch (error) {
        console.error('❌ Error in audio playback:', error);
        this.cleanupTempFile();
        reject(error);
      }
    });
  }

  // Helper method to play loaded sound
  private playLoadedSound(resolve: () => void, reject: (error: any) => void): void {
    if (!this.sound) {
      reject(new Error('No sound object'));
      return;
    }

    this.isPlaying = true;
    this.sound.play((success) => {
      this.isPlaying = false;
      
      if (success) {
        console.log('✅ Audio playback completed');
        resolve();
      } else {
        console.error('❌ Audio playback failed');
        reject(new Error('Playback failed'));
      }
      
      // Cleanup after playback
      this.cleanupTempFile();
    });
  }

  // Clean up temporary file
  private cleanupTempFile(): void {
    if (this.tempFilePath) {
      RNFS.unlink(this.tempFilePath)
        .then(() => console.log('🗑️ Temp audio file cleaned'))
        .catch(error => console.log('Warning: Failed to cleanup temp file:', error));
      this.tempFilePath = null;
    }
  }

  // Stop current audio playback
  stop(): void {
    if (this.sound) {
      this.sound.stop();
      this.sound.release();
      this.sound = null;
      this.isPlaying = false;
      console.log('⏹️ Audio stopped and released');
    }
    this.cleanupTempFile();
  }

  // Check if audio is currently playing
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume: number): void {
    if (this.sound) {
      this.sound.setVolume(volume);
    }
  }
}

// Singleton instance
export const audioPlayer = new AudioPlayer();

// Helper function to play AI audio
export const playAIAudio = async (audioBase64: string): Promise<void> => {
  try {
    await audioPlayer.playFromBase64(audioBase64);
  } catch (error) {
    console.error('❌ Failed to play AI audio:', error);
    throw error;
  }
};