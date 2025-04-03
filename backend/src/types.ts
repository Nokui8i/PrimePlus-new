import { types } from 'mediasoup'
import { Socket } from 'socket.io'

export interface Peer {
  id: string
  socket: Socket
  transports: Map<string, types.Transport>
  producers: Map<string, types.Producer>
  consumers: Map<string, types.Consumer>
}

export interface Room {
  id: string
  router: types.Router
  peers: Map<string, Peer>
}

export interface TransportInfo {
  id: string
  iceParameters: types.IceParameters
  iceCandidates: types.IceCandidate[]
  dtlsParameters: types.DtlsParameters
  sctpParameters?: types.SctpParameters
}

export interface ProducerInfo {
  id: string
  producer: types.Producer
}

export interface ConsumerInfo {
  id: string
  consumer: types.Consumer
}

export interface CreateRoomResponse {
  routerRtpCapabilities: types.RtpCapabilities
}

export interface JoinRoomResponse {
  routerRtpCapabilities: types.RtpCapabilities
  peers: {
    id: string
    producers: {
      id: string
      kind: string
      rtpParameters: types.RtpParameters
    }[]
  }[]
} 