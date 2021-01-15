import React, {Component} from 'react';
const axios = require('axios');
const axInstance = axios.create({
    baseURL: "http://130.240.200.61:5000"
});

export default axInstance;
