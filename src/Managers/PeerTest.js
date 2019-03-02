import Peer from "peerjs";

export default class PeerTest {
    peerID = 'rg53cxdaw0f00000';

    constructor() {
        this.peer = new Peer({ key: 'lwjd5qra8257b9' });

        this.conn = peer.connect(peerID);
        this.conn.on('open', function () {
            conn.send('hi!');
        });
    }
}