function WSSHClient() {
};

WSSHClient.prototype._generateEndpoint = function() {
    if (window.location.protocol == 'https:') {
        var protocol = 'wss://';
        //var protocol = 'wss://14.29.87.15:8888/';
    } else {
        var protocol = 'ws://';
        //var protocol = 'ws://14.29.87.15:8888/';
    }
    //var endpoint = protocol + window.location.host + '/ws';
    var endpoint = protocol + window.location.host + ':8888/ws';
    return endpoint;
};

WSSHClient.prototype.connect = function(options) {
    var endpoint = this._generateEndpoint();

    if (window.WebSocket) {
        this._connection = new WebSocket(endpoint);
    }
    else if (window.MozWebSocket) {
        this._connection = MozWebSocket(endpoint);
    }
    else {
        options.onError('WebSocket Not Supported');
        return ;
    }

    this._connection.onopen = function() {
        options.onConnect();
    };

    this._connection.onmessage = function (evt) {
        var data=evt.data.toString()
        options.onData(data);
    };


    this._connection.onclose = function(evt) {
        options.onClose();
    };
};

WSSHClient.prototype.send = function(data) {
    this._connection.send(JSON.stringify(data));
};

WSSHClient.prototype.sendInitData=function(){
    var data= {
        hostname: window.localStorage.host,
        port: window.localStorage.port,
        username: window.localStorage.username,
        password: window.localStorage.password
    }
    this._connection.send(JSON.stringify({"tp":"init","data":data}))
}

WSSHClient.prototype.sendClientData=function(data){
    this._connection.send(JSON.stringify({"tp":"client","data":data}))
}

var client = new WSSHClient();
