import config from './config/config.js'
import PlayerUiController from './PlayerUiController/PlayerUiController.js'
import QueueManager from './QueueManager/QueueManager.js'

const playerUiController = new PlayerUiController('#player')
const queueManager = new QueueManager(config, playerUiController)

const savedIndex = localStorage.getItem('video_queue_index')

const startIndex = savedIndex ? parseInt(savedIndex, 10) : 0

queueManager.start(startIndex)

console.log(config)