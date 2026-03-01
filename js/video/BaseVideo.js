export default class BaseVideo {
    constructor(config, playerUiController) {
        this.config = config
        this.playerUiController = playerUiController
        this.$video = playerUiController.$video
    }

    async prepare() {
        return new Promise(resolve => {
            this.$video.src = this.config.src
            this.$video.load()

            const onCanPlay = () => {
                const savedTime = localStorage.getItem('video_last_pos')
                
                if (savedTime !== null) {
                    this.$video.currentTime = parseFloat(savedTime)

                    localStorage.removeItem('video_last_pos')
                } else if (this.config.startFrom) {
                    this.$video.currentTime = this.config.startFrom
                }

                this.$video.removeEventListener('canplaythrough', onCanPlay)
                
                resolve()
            }

            this.$video.addEventListener('canplaythrough', onCanPlay)
        })
    }

    async playWithRetry() {
        try {
            await this.$video.play()

            this.playerUiController.hideUserPlayOverlay()
        } catch (error) {
            if (error.name === 'NotAllowedError') {
                this.playerUiController.showUserPlayOverlay()

                return new Promise((resolve) => {
                    this.playerUiController.onUserInteracted = async () => {
                        await this.$video.play()

                        this.playerUiController.hideUserPlayOverlay()

                        this.playerUiController.onUserInteracted = null

                        resolve()
                    }
                })
            }
            
            throw error
        }
    }

    async waitForEnd() {
        return new Promise((resolve) => {
            const skipAfter = this.config.skipAfter
            let skipTimeout = null

            const cleanup = () => {
                this.$video.removeEventListener('ended', onEnded)
                this.$video.removeEventListener('timeupdate', onTimeUpdate)

                if (skipTimeout) clearTimeout(skipTimeout)
            }

            const onEnded = () => {
                cleanup()
                resolve()
            }

            const onTimeUpdate = () => {
                if (skipAfter && this.$video.currentTime >= skipAfter) {
                    cleanup()
                    resolve()
                }
            }

            this.$video.addEventListener('ended', onEnded)
            
            if (skipAfter) {
                this.$video.addEventListener('timeupdate', onTimeUpdate)
            }
        })
    }

    async run() {
        throw new Error('Metoda run() musi być zaimplementowana w klasie potomnej')
    }
}