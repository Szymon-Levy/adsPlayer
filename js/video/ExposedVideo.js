import BaseVideo from "./BaseVideo.js"

export default class ExposedVideo extends BaseVideo {
    async run() {
        await this.prepare()

        this.playerUiController.addObservingClasses()
        this.playerUiController.showTimer()

        const updateTimer = () => {
            const timeLeft = Math.ceil(this.$video.duration - this.$video.currentTime)

            this.playerUiController.updateTimer(this.playerUiController.formatTime(timeLeft))
        }

        this.$video.addEventListener('timeupdate', updateTimer)

        await this.playWithRetry()

        await this.waitForEnd()
        
        // cleanup
        this.$video.removeEventListener('timeupdate', updateTimer)

        this.playerUiController.removeObservingClasses()
        this.playerUiController.hideTimer()
    }
}