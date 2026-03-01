import BaseVideo from "./BaseVideo.js"

export default class DummyVideo extends BaseVideo {
    async run() {
        await this.prepare()

        await this.playWithRetry()

        await this.waitForEnd()
    }
}