export const apiService = (function () {
    "use strict";
    const module = {};

    module.enqueue = function (userId) {
        return fetch("http://localhost:3000/api/queues/enqueue", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
        }).then((res) => res.json());
    }

    module.dequeue = function (userId) {
        return fetch("http://localhost:3000/api/queues/dequeue", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
        }).then((res) => res.json());
    }

    module.getQueue = function () {
        return fetch("http://localhost:3000/api/queues");
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

    module.pairUsers = function (userId1, userId2, status) {
        return fetch("http://localhost:3000/api/pairs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId1, userId2, status }),
        }).then((res) => res.json());
    }

    module.getPair = function (id) {
        return fetch(`http://localhost:3000/api/pairs/${id}`).then((res) => res.json());
    }

    module.deletePair = function (id) {
        return fetch(`http://localhost:3000/api/pairs/${id}`, {
            method: "DELETE",
        }).then((res) => res.json());
    }

    module.createRoom = function (status, userId1, userId2) {
        return fetch("http://localhost:3000/api/rooms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status, userId1, userId2 }),
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