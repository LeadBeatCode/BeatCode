export const apiService = (function () {
    "use strict";
    const module = {};

    module.enqueue = function (userId, socketId) {
        return fetch("http://localhost:3000/api/queues/enqueue", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, socketId }),
        }).then((res) => res.json());
    }

    module.dequeue = function (socketId) {
        return fetch("http://localhost:3000/api/queues/dequeue", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({socketId}),
        }).then((res) => res.json());
    }

    module.deleteQueue = function (socketId) {
        return fetch("http://localhost:3000/api/queues", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({socketId}),
        }).then((res) => res.json());
    }

    module.getQueue = function () {
        return fetch("http://localhost:3000/api/queues").then((res) => res.json());
    }

    module.signup = function (username, password) {
        return fetch("http://localhost:3000/api/users/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        }).then((res) => res.json());
    }

    module.login = function (username, password) {
        return fetch("http://localhost:3000/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        }).then((res) => res.json());
    }

    module.createPair = function (userId1, userId2, socketId1, socketId2) {
        return fetch("http://localhost:3000/api/pairs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId1, userId2, socketId1, socketId2}),
        }).then((res) => res.json());
    }

    module.getPair = function (id) {
        return fetch(`http://localhost:3000/api/pairs/${id}`).then((res) => res.json());
    }

    module.setPlayerStatus = function (id, status, userId) {
        return fetch(`http://localhost:3000/api/pairs/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status , userId}),
        }).then((res) => res.json());
    }

    module.deletePair = function (id) {
        return fetch(`http://localhost:3000/api/pairs/${id}`, {
            method: "DELETE",
        }).then((res) => res.json());
    }

    module.createRoom = function (status, userId1, userId2, socketId1, socketId2) {
        return fetch("http://localhost:3000/api/rooms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status, userId1, userId2, socketId1, socketId2}),
        }).then((res) => res.json());
    }

    module.getRoom = function (id) {
        return fetch(`http://localhost:3000/api/rooms/${id}`).then((res) => res.json());
    }

    module.deleteRoom = function (id) {
        return fetch(`http://localhost:3000/api/rooms/${id}`, {
            method: "DELETE",
        }).then((res) => res.json());
    }

    return module;
}());