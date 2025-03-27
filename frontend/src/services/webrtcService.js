import api from './api';

class WebRTCService {
    constructor() {
      this.peerConnection = null;
      this.localStream = null;
      this.remoteStream = null;
      this.configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      };
    }
  
    // Create a new WebRTC connection
    createConnection() {
      this.peerConnection = new RTCPeerConnection(this.configuration);
      
      // Set up basic listeners
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // Here you can add logic to transmit the candidate
          console.log('New ICE candidate:', event.candidate);
        }
      };
  
      this.peerConnection.ontrack = (event) => {
        this.remoteStream = event.streams[0];
      };
  
      // Store the connection
      return this.peerConnection;
    }
  
    // Add local media stream
    async addLocalStream(constraints = { video: true, audio: true }) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Store the local stream
        this.localStream = stream;
        
        stream.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, stream);
        });
  
        return stream;
      } catch (error) {
        console.error('Error getting local stream:', error);
        throw error;
      }
    }
  
    // Get WebRTC connection
    getConnection() {
      if (!this.peerConnection) {
        this.createConnection();
      }
      
      // Add tracks from stream
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          const senders = this.peerConnection.getSenders();
          const hasSender = senders.find(sender => sender.track === track);
          
          if (!hasSender) {
            this.peerConnection.addTrack(track, this.localStream);
          }
        });
      }
  
      return this.peerConnection;
    }
  
    // Add remote stream
    addRemoteStream(stream) {
      if (!this.peerConnection) {
        throw new Error('No RTCPeerConnection exists');
      }
  
      this.remoteStream = stream;
      
      stream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, stream);
      });
    }
  
    // Create connection offer
    async createOffer() {
      if (!this.peerConnection) {
        throw new Error('No RTCPeerConnection exists');
      }
  
      try {
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        
        return offer;
      } catch (error) {
        console.error('Error creating offer:', error);
        throw error;
      }
    }
  
    // Handle connection answer
    async handleAnswer(answer) {
      if (!this.peerConnection) {
        throw new Error('No RTCPeerConnection exists');
      }
  
      try {
        const rtcSessionDescription = new RTCSessionDescription(answer);
        await this.peerConnection.setRemoteDescription(rtcSessionDescription);
      } catch (error) {
        console.error('Error handling answer:', error);
        throw error;
      }
    }
  
    // Add ICE Candidate
    async addIceCandidate(candidate) {
      if (!this.peerConnection) {
        throw new Error('No RTCPeerConnection exists');
      }
  
      try {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
        throw error;
      }
    }
  
    // Close connection
    closeConnection() {
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }
      
      // Cleanup resources
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }
      
      if (this.remoteStream) {
        this.remoteStream.getTracks().forEach(track => track.stop());
        this.remoteStream = null;
      }
    }
  
    // Get local stream
    getLocalStream() {
      return this.localStream;
    }
  
    // Get remote stream
    getRemoteStream() {
      return this.remoteStream;
    }
  
    // Check connection state
    getConnectionState() {
      return this.peerConnection ? this.peerConnection.connectionState : 'closed';
    }
  }
  
  // Create singleton instance of the service
  const webRTCService = new WebRTCService();
  export default webRTCService;