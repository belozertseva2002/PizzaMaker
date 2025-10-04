class SoundManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {}; 
        this.musicSource = null;
        this.currentMusicName = null;
        this.activeSfx = {}
        this.BASE_VOLUME = 0.7;
        this.MUSIC_VOLUME = 0.3;
        this.isMuted = false;
        this.originalMusicVolume = this.MUSIC_VOLUME; 
        this.originalSFXVolume = this.BASE_VOLUME; 
    }
    resumeContext() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('AudioContext возобновлен.');
            });
        }
    }
    async loadSound(url, name) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            this.sounds[name] = audioBuffer;
            return audioBuffer;
        } catch (error) {
            console.error(`Ошибка загрузки звука "${name}" по адресу ${url}:`, error);
        }
    }
    playSound(name, volume = this.BASE_VOLUME, loop = false) {
        this.resumeContext();

        const buffer = this.sounds[name];
        if (!buffer) {
            console.warn(`Звук "${name}" не найден для воспроизведения.`);
            return;
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;

        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.isMuted ? 0 : volume;
        
        if (loop && this.activeSfx[name]) {
            console.warn(`SFX "${name}" уже играет. Остановка и перезапуск.`)
            this.stopMusic(name)
        }

        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.loop = loop
        source.start(0);
        
        const sfxData = {source, gainNode, originalVolume: volume}
        if (loop) {
            this.activeSfx[name] = sfxData; 
        } else {
            source.onended = () => {
                source.disconnect();
                gainNode.disconnect();
                delete this.activeSfx[name];
            }
        }
        return sfxData;
    }
    playMusic(name, volume = this.MUSIC_VOLUME) {
        this.resumeContext(); 
        this.stopMusic()
        if (this.musicSource) {
            this.musicSource.stop(0);
            this.musicSource.disconnect();
            this.musicSource = null;
        }

        const buffer = this.sounds[name];
        if (!buffer) {
            console.warn(`Фоновая музыка "${name}" не найдена.`);
            return;
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.isMuted ? 0 : volume;

        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.loop = true; 
        source.start(0);

        this.musicSource = {source, gainNode}; 
        this.currentMusicName = name;
    }
    stopMusic(name = null) {
        if (name) {
            const sfxData = this.activeSfx[name];
            if (sfxData && sfxData.source) {
                sfxData.source.stop(0);
                sfxData.source.disconnect();
                if (sfxData.gainNode) sfxData.gainNode.disconnect();
                delete this.activeSfx[name];
            }
        } else {
            if (this.musicSource && this.musicSource.source) {
                this.musicSource.source.stop(0);
                this.musicSource.source.disconnect();
                if (this.musicSource.gainNode) this.musicSource.gainNode.disconnect();
                this.musicSource = null;
                this.currentMusicName = null;
            }
        }
    }
    setMasterVolume(volume) {
        if (this.musicSource && this.musicSource.gainNode) {
            this.musicSource.gainNode.gain.value = volume;
        }
        for (const sfxName in this.activeSfx) {
            if (this.activeSfx.hasOwnProperty(sfxName) && this.activeSfx[sfxName].gainNode) {
                this.activeSfx[sfxName].gainNode.gain.value = volume;
            }
        }
    }
    toggleMasterMute() {
        this.isMuted = !this.isMuted; 
        
        if (this.isMuted) {
            if (this.musicSource && this.musicSource.gainNode) {
                this.originalMusicVolume = this.musicSource.gainNode.gain.value;
            }
            this.originalSFXVolume = this.BASE_VOLUME; 

            this.setMasterVolume(0); 
        } else {
            if (this.musicSource && this.musicSource.gainNode) {
                this.musicSource.gainNode.gain.value = this.originalMusicVolume;
            }
            for (const sfxName in this.activeSfx) {
                if (this.activeSfx.hasOwnProperty(sfxName)) {
                    const sfxData = this.activeSfx[sfxName];
                    if (sfxData.gainNode) {
                        sfxData.gainNode.gain.value = sfxData.originalVolume; 
                    }
                }
            } 
        }
    }
}
export const soundManager = new SoundManager()