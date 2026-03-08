import BaseVideo from "./BaseVideo.js"

export default class PausedExposedVideo extends BaseVideo {
    constructor(config, uiController) {
        super(config, uiController)
        
        this.pauseAdSeen = localStorage.getItem('pause_ad_seen') ?? false
        this.pauseAdRemainingTime = localStorage.getItem('pause_ad_remaining_time') ?? 10
    }

    async run() {
        await this.prepare()

        this.playerUiController.showPlaypauseControls()
        this.playerUiController.showProgressBar()
        this.playerUiController.showTimeInfo()

        if (!this.pauseAdSeen && this.$video.currentTime >= 10) {
            await this.handleAdDisplaying()
        } else {
            await this.handleRegularPlaying()
        }
        
        // this.playerUiController.handleUserMousemoveActivity()

        await this.waitForEnd()
        
        // cleanup
        this.playerUiController.isVideoWithControlsActive = false

        this.playerUiController.hidePlaypauseControls()
        this.playerUiController.hideProgressBar()
        this.playerUiController.hideTimeInfo()
    }

    async handleRegularPlaying() {
        return new Promise(async (resolve) => {
            const onTimeUpdate = async () => {
                if (this.$video.currentTime >= 10 && !this.pauseAdSeen) {
                    this.$video.removeEventListener('timeupdate', onTimeUpdate)

                    await this.handleAdDisplaying()

                    resolve()
                }
            }

            this.$video.addEventListener('timeupdate', onTimeUpdate)

            this.playerUiController.isVideoWithControlsActive = true

            await this.playWithRetry()
        })
    }

    async handleAdDisplaying() {
        this.$video.pause()

        this.playerUiController.hideProgressBar()
        this.playerUiController.hidePlaypauseControls()
        this.playerUiController.hideTimeInfo()
        this.playerUiController.showPauseAd(this.config.pauseAdSrc)
        this.playerUiController.isVideoWithControlsActive = false

        return new Promise((resolve) => {
            const interval = setInterval(async () => {
                this.pauseAdRemainingTime--
                console.log(`Pozostało reklamy: ${this.pauseAdRemainingTime}s`)
                
                localStorage.setItem('pause_ad_remaining_time', this.pauseAdRemainingTime)

                if (this.pauseAdRemainingTime <= 0) {
                    clearInterval(interval)
                    
                    localStorage.setItem('pause_ad_seen', true)
                    
                    this.playerUiController.hidePauseAd()
                    this.playerUiController.showProgressBar()
                    this.playerUiController.showPlaypauseControls()
                    this.playerUiController.showTimeInfo()
                    
                    await this.playWithRetry()

                    resolve()
                }
            }, 1000)
        })
    }
}