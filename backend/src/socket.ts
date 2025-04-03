import { Server, Socket } from 'socket.io'
import { types } from 'mediasoup'
import { RoomManager } from './room'
import { TransportInfo, ProducerInfo, ConsumerInfo } from './types'

export class SocketManager {
  constructor(private roomManager: RoomManager) {}

  handleSocket(io: Server): void {
    io.on('connection', (socket: Socket) => {
      console.log('Client connected:', socket.id)

      socket.on('create-room', async (roomId: string, callback: (response: any) => void) => {
        try {
          const room = await this.roomManager.createRoom(roomId)
          const router = room.router
          const routerRtpCapabilities = router.rtpCapabilities

          callback({ routerRtpCapabilities })
        } catch (error) {
          console.error('Error creating room:', error)
          callback({ error: 'Failed to create room' })
        }
      })

      socket.on('join-room', async (roomId: string, callback: (response: any) => void) => {
        try {
          const room = this.roomManager.getRoom(roomId)
          if (!room) {
            throw new Error('Room not found')
          }

          const peer = await this.roomManager.addPeer(roomId, socket.id, socket)
          const router = room.router
          const routerRtpCapabilities = router.rtpCapabilities

          // Get existing peers and their producers
          const peers = this.roomManager.getPeers(roomId)
          const peersInfo = peers
            .filter((p) => p.id !== socket.id)
            .map((p) => ({
              id: p.id,
              producers: Array.from(p.producers.values()).map((producer) => ({
                id: producer.id,
                kind: producer.kind,
                rtpParameters: producer.rtpParameters,
              })),
            }))

          callback({
            routerRtpCapabilities,
            peers: peersInfo,
          })
        } catch (error) {
          console.error('Error joining room:', error)
          callback({ error: 'Failed to join room' })
        }
      })

      socket.on('create-transport', async (
        roomId: string,
        callback: (response: TransportInfo) => void
      ) => {
        try {
          const room = this.roomManager.getRoom(roomId)
          if (!room) {
            throw new Error('Room not found')
          }

          const transport = await this.roomManager.getRouterManager().createWebRtcTransport(
            room.router,
            async (transport) => {
              await this.roomManager.createTransport(roomId, socket.id, transport.id, transport)
            }
          )

          callback({
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
            sctpParameters: transport.sctpParameters,
          })
        } catch (error) {
          console.error('Error creating transport:', error)
          callback({ error: 'Failed to create transport' } as any)
        }
      })

      socket.on('connect-transport', async (
        { transportId, dtlsParameters }: { transportId: string; dtlsParameters: types.DtlsParameters },
        callback: (response: any) => void
      ) => {
        try {
          const room = this.roomManager.getRoom(transportId.split(':')[0])
          if (!room) {
            throw new Error('Room not found')
          }

          const peer = this.roomManager.getPeer(room.id, socket.id)
          if (!peer) {
            throw new Error('Peer not found')
          }

          const transport = peer.transports.get(transportId)
          if (!transport) {
            throw new Error('Transport not found')
          }

          await transport.connect({ dtlsParameters })
          callback({})
        } catch (error) {
          console.error('Error connecting transport:', error)
          callback({ error: 'Failed to connect transport' })
        }
      })

      socket.on('produce', async (
        { transportId, kind, rtpParameters }: { transportId: string; kind: types.MediaKind; rtpParameters: types.RtpParameters },
        callback: (response: ProducerInfo) => void
      ) => {
        try {
          const room = this.roomManager.getRoom(transportId.split(':')[0])
          if (!room) {
            throw new Error('Room not found')
          }

          const peer = this.roomManager.getPeer(room.id, socket.id)
          if (!peer) {
            throw new Error('Peer not found')
          }

          const transport = peer.transports.get(transportId)
          if (!transport) {
            throw new Error('Transport not found')
          }

          const producer = await transport.produce({ kind, rtpParameters })
          await this.roomManager.createProducer(room.id, socket.id, producer.id, producer)

          callback({
            id: producer.id,
            producer,
          })
        } catch (error) {
          console.error('Error producing:', error)
          callback({ error: 'Failed to produce' } as any)
        }
      })

      socket.on('consume', async (
        { producerId }: { producerId: string },
        callback: (response: ConsumerInfo) => void
      ) => {
        try {
          const room = this.roomManager.getRoom(producerId.split(':')[0])
          if (!room) {
            throw new Error('Room not found')
          }

          const peer = this.roomManager.getPeer(room.id, socket.id)
          if (!peer) {
            throw new Error('Peer not found')
          }

          const transport = Array.from(peer.transports.values())[0]
          if (!transport) {
            throw new Error('Transport not found')
          }

          const consumer = await transport.consume({
            producerId,
            rtpCapabilities: room.router.rtpCapabilities,
          })
          await this.roomManager.createConsumer(room.id, socket.id, consumer.id, consumer)

          callback({
            id: consumer.id,
            consumer,
          })
        } catch (error) {
          console.error('Error consuming:', error)
          callback({ error: 'Failed to consume' } as any)
        }
      })

      socket.on('disconnect', async () => {
        console.log('Client disconnected:', socket.id)
        // Find and remove peer from all rooms
        for (const room of this.roomManager.getRouterManager().rooms.values()) {
          if (room.peers.has(socket.id)) {
            await this.roomManager.removePeer(room.id, socket.id)
          }
        }
      })
    })
  }
} 