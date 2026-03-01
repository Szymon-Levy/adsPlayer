import BaseVideo from "./BaseVideo.js"

export default class ContentVideo extends BaseVideo {
    async run() {
        await this.prepare()

        this.playerUiController.showPlaypauseControls()
        this.playerUiController.showProgressBar()
        
        await this.playWithRetry()

        this.playerUiController.handleUserMousemoveActivity()

        await this.waitForEnd()
        
        // cleanup
        this.playerUiController.isVideoWithControlsActive = false

        this.playerUiController.hidePlaypauseControls()
        this.playerUiController.hideProgressBar()
    }
}