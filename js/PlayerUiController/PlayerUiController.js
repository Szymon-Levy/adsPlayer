export default class PlayerUiController {
    constructor(playerSelector) {
        this.$player = document.querySelector(playerSelector)
        this.$video = this.$player.querySelector('video')
        this.$timer = this.$player.querySelector('#timer')
        this.$userPlayOverlay = this.$player.querySelector('#user-play-overlay')
        this.$playPauseControls = this.$player.querySelector('#playPause-controls')
        this.$playBtn = this.$player.querySelector('#play-btn')
        this.$pauseBtn = this.$player.querySelector('#pause-btn') 
        this.$progressBar = this.$player.querySelector('#progress-bar')
        this.$progressLine = this.$player.querySelector('#progress-line')
        this.$timeInfo = this.$player.querySelector('#time-info')
        this.$currentTime = this.$player.querySelector('#current-time')
        this.$durationTime = this.$player.querySelector('#duration-time')

        this.controlsTimeout = null
        this.isVideoWithControlsActive = false

        this.onUserInteracted = null

        this.events()
    }

    events() {
        this.$userPlayOverlay.addEventListener('click', async () => {
            if (typeof this.onUserInteracted === 'function') {
                this.onUserInteracted();
            }
        })

        this.$video.addEventListener('play', () => this.togglePlayPauseButtons(true))
        this.$video.addEventListener('pause', () => this.togglePlayPauseButtons(false))

        this.$playBtn.addEventListener('click', () => this.$video.play())
        this.$pauseBtn.addEventListener('click', () => this.$video.pause())

        this.$player.addEventListener('mousemove', () => {
            this.handleUserMousemoveActivity()
        })

        this.$video.addEventListener('timeupdate', () => {
            this.updateProgressBar()
            this.updateTimeInfo()

            if (this.$video.currentTime > 0) {
                localStorage.setItem('video_last_pos', this.$video.currentTime)
            }
        })

        this.$video.addEventListener('loadedmetadata', () => {
            this.$durationTime.textContent = this.formatTime(this.$video.duration)
        })
    }

    togglePlayPauseButtons(isPlaying) {
        if (isPlaying) {
            this.$playBtn.style.display = 'none'
            this.$pauseBtn.style.display = 'flex'
        } else {
            this.$playBtn.style.display = 'flex'
            this.$pauseBtn.style.display = 'none'
        }
    }

    showPlaypauseControls() {
        this.isVideoWithControlsActive = true

        this.$playPauseControls.classList.add('active')
    }

    hidePlaypauseControls() {
        this.$playPauseControls.classList.remove('active')
    }

    showTimer() {
        this.$timer.classList.add('active')
    }

    hideTimer() {
        this.$timer.classList.remove('active')
    }

    updateTimer(time) {
        this.$timer.textContent = `Remaining: ${time}`
    }

    addObservingClasses() {
        this.$video.classList.add('observable')
    }

    removeObservingClasses() {
        this.$video.classList.remove('observable')
    }

    showUserPlayOverlay() {
        this.$userPlayOverlay.classList.add('active')
    }

    hideUserPlayOverlay() {
        this.$userPlayOverlay.classList.remove('active')
    }

    showProgressBar() {
        this.isVideoWithControlsActive = true

        this.$progressBar.classList.add('active')
    }

    hideProgressBar() {
        this.$progressBar.classList.remove('active')
    }

    showTimeInfo() {
        this.isVideoWithControlsActive = true

        this.$timeInfo.classList.add('active')
    }

    hideTimeInfo() {
        this.$timeInfo.classList.remove('active')
    }

    handleUserMousemoveActivity() {
        if (!this.isVideoWithControlsActive) return

        this.showPlaypauseControls()
        this.showProgressBar()
        this.showTimeInfo()

        if (this.controlsTimeout) {
            clearTimeout(this.controlsTimeout)
        }

        if (!this.$video.paused) {
            this.controlsTimeout = setTimeout(() => {
                this.hidePlaypauseControls()
                this.hideProgressBar()
                this.hideTimeInfo()
            }, 5000)
        }
    }

    updateProgressBar() {
        if (!this.$video.duration) return

        const percentage = (this.$video.currentTime / this.$video.duration) * 100

        this.$progressLine.style.width = `${percentage}%`
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00'
        
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        const formattedSecs = secs < 10 ? `0${secs}` : secs
        
        return `${mins}:${formattedSecs}`
    }

    updateTimeInfo() {
        this.$currentTime.textContent = this.formatTime(this.$video.currentTime)
    }

    showPauseAd(src) {
        const html = `
            <div id="pause-ad">
                <img src="${src}">
            </div>
        `

        this.$player.insertAdjacentHTML('beforeend', html)
    }

    hidePauseAd() {
        const ad = this.$player.querySelector('#pause-ad')

        if (!ad) return
        
        ad.remove()
    }
}