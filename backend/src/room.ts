import { types } from 'mediasoup'
import { Socket } from 'socket.io'
import { Peer, Room } from './types'
import { RouterManager } from './router'

export class RoomManager {
  constructor(private routerManager: RouterManager) {}

  get rooms(): Map<string, Room> {
    return this.routerManager.rooms
  }

  async createRoom(roomId: string): Promise<Room> {
    const router = await this.routerManager.createRouter(roomId)
    const room: Room = {
      id: roomId,
      router,
      peers: new Map(),
    }
    this.rooms.set(roomId, room)
    return room
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId)
  }

  async deleteRoom(roomId: string): Promise<void> {
    const room = this.rooms.get(roomId)
    if (room) {
      // Close all peer connections
      for (const peer of room.peers.values()) {
        await this.removePeer(roomId, peer.id)
      }
      // Delete router
      await this.routerManager.deleteRouter(roomId)
      this.rooms.delete(roomId)
    }
  }

  async addPeer(roomId: string, peerId: string, socket: Socket): Promise<Peer> {
    const room = this.rooms.get(roomId)
    if (!room) {
      throw new Error(`Room ${roomId} not found`)
    }

    const peer: Peer = {
      id: peerId,
      socket,
      transports: new Map(),
      producers: new Map(),
      consumers: new Map(),
    }

    room.peers.set(peerId, peer)
    return peer
  }

  async removePeer(roomId: string, peerId: string): Promise<void> {
    const room = this.rooms.get(roomId)
    if (!room) {
      return
    }

    const peer = room.peers.get(peerId)
    if (!peer) {
      return
    }

    // Close all transports
    for (const transport of peer.transports.values()) {
      transport.close()
    }

    // Close all producers
    for (const producer of peer.producers.values()) {
      producer.close()
    }

    // Close all consumers
    for (const consumer of peer.consumers.values()) {
      consumer.close()
    }

    room.peers.delete(peerId)
  }

  getPeer(roomId: string, peerId: string): Peer | undefined {
    const room = this.rooms.get(roomId)
    return room?.peers.get(peerId)
  }

  getPeers(roomId: string): Peer[] {
    const room = this.rooms.get(roomId)
    return room ? Array.from(room.peers.values()) : []
  }

  async createTransport(
    roomId: string,
    peerId: string,
    transportId: string,
    transport: types.Transport
  ): Promise<void> {
    const peer = this.getPeer(roomId, peerId)
    if (!peer) {
      throw new Error(`Peer ${peerId} not found in room ${roomId}`)
    }

    peer.transports.set(transportId, transport)
  }

  async createProducer(
    roomId: string,
    peerId: string,
    producerId: string,
    producer: types.Producer
  ): Promise<void> {
    const peer = this.getPeer(roomId, peerId)
    if (!peer) {
      throw new Error(`Peer ${peerId} not found in room ${roomId}`)
    }

    peer.producers.set(producerId, producer)
  }

  async createConsumer(
    roomId: string,
    peerId: string,
    consumerId: string,
    consumer: types.Consumer
  ): Promise<void> {
    const peer = this.getPeer(roomId, peerId)
    if (!peer) {
      throw new Error(`Peer ${peerId} not found in room ${roomId}`)
    }

    peer.consumers.set(consumerId, consumer)
  }

  getRouterManager(): RouterManager {
    return this.routerManager
  }
} 