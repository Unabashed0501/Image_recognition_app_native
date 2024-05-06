import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { resolve } from 'path';
import api from './api.ts';

export default function configure(app: Application) {
    app
        .get('/', (req, res, next) => {
            // res.sendFile(resolve(__dirname, '../index.html'));
            res.send("Hello world!")
            console.log("get Hello world!")
        })
        .use(express.static('public'))
        .use(bodyParser.json({limit: '50mb'}))
        .use(bodyParser.urlencoded({limit: '50mb', extended: true}))
        .use('/api', api())
        .use('/error', (req, res, next) => {
            next(new Error('Other Error'));
        })
        .use((req, res, next) => {
            next(new Error('Not Found'));
        })
        .use((error: Error, req: Request, res: Response, next: NextFunction) => {
            // switch (error.message) {
            //     case 'Not Found':
            //         res.sendFile(resolve(__dirname, '../notfound.html'));
            //         return;
            // }

            // res.sendFile(resolve(__dirname, '../error.html'));
        });
}