import * as mediasoup from 'mediasoup'
import { types } from 'mediasoup'
import { config } from './config'
import { Room } from './types'

export class RouterManager {
  private worker: mediasoup.types.Worker
  private routers: Map<string, types.Router>
  private _rooms: Map<string, Room>

  constructor() {
    this.worker = mediasoup.createWorker({
      logLevel: config.mediasoup.worker.logLevel,
      logTags: config.mediasoup.worker.logTags,
      rtcMinPort: config.mediasoup.worker.rtcMinPort,
      rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
    })
    this.routers = new Map()
    this._rooms = new Map()
  }

  get rooms(): Map<string, Room> {
    return this._rooms
  }

  async createRouter(roomId: string): Promise<types.Router> {
    const router = await this.worker.createRouter({
      mediaCodecs: config.mediasoup.router.mediaCodecs,
    })
    this.routers.set(roomId, router)
    return router
  }

  getRouter(roomId: string): types.Router | undefined {
    return this.routers.get(roomId)
  }

  async deleteRouter(roomId: string): Promise<void> {
    const router = this.routers.get(roomId)
    if (router) {
      await router.close()
      this.routers.delete(roomId)
    }
  }

  async createWebRtcTransport(
    router: types.Router,
    callback: (transport: types.WebRtcTransport) => void
  ): Promise<types.WebRtcTransport> {
    const transport = await router.createWebRtcTransport({
      listenIps: config.mediasoup.webRtcTransport.listenIps,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    })

    callback(transport)

    return transport
  }

  async createPlainTransport(
    router: types.Router,
    callback: (transport: types.PlainTransport) => void
  ): Promise<types.PlainTransport> {
    const transport = await router.createPlainTransport({
      listenIp: config.mediasoup.plainTransport.listenIp,
      enableSctp: true,
    })

    callback(transport)

    return transport
  }
} 