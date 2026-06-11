import winston from 'winston';
import LokiTransport from 'winston-loki';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
    
  ),
  transports: [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        )
    }),
    new LokiTransport({
      host: 'http://loki:3100',
      labels: { service: "backend"},
      json: true,
        format: winston.format.json(),
        replaceTimestamp: true,
        onConnectionError: (error) => console.error(error),
    })
  ]
});

export { logger };