import ExposedVideo from "../video/ExposedVideo.js"
import PausedExposedVideo from "../video/PausedExposedVideo.js"
import DummyVideo from "../video/DummyVideo.js"
import ContentVideo from "../video/ContentVideo.js"

export default class QueueManager {
    constructor(config, playerUiController) {
        const typeMap = {
            'exposed': ExposedVideo,
            'pausedExposed': PausedExposedVideo,
            'dummy': DummyVideo,
            'content': ContentVideo,
        }

        this.queue = config.map(item => 
            new typeMap[item.type](item, playerUiController)
        )
    }

    async start(startFrom = 0) {
        const queueLength = this.queue.length

        if (startFrom > queueLength - 1) {
            startFrom = 0
        }

        for (let i = startFrom; i < queueLength; i++) {
            localStorage.setItem('video_queue_index', i)

            await this.queue[i].run()

            localStorage.removeItem('video_last_pos')
        }
    }
}